/**
 * Google Sheets Data Provider
 * Implements data fetching from Google Sheets using the Sheets API v4
 */

import { google } from 'googleapis';
import type { sheets_v4 } from 'googleapis';
import { BaseDataProvider } from '../base/BaseDataProvider';
import {
  ConnectionError,
  AuthenticationError,
  TransformationError,
  type GoogleSheetsConfig,
  type DataProviderConfig,
  type ConnectionTestResult,
  type TransformationResult,
} from '@/types/providers';
import type { AnalyticsData, AnalyticsQuery, AnalyticsRecord } from '@/types/analytics';

export class GoogleSheetsDataProvider extends BaseDataProvider {
  private sheetsClient: sheets_v4.Sheets | null = null;
  private auth: any = null;

  constructor() {
    super('Google Sheets', 'google-sheets');
  }

  async connect(config: DataProviderConfig): Promise<ConnectionTestResult> {
    if (config.type !== 'google-sheets') {
      throw new Error('Invalid config type for Google Sheets provider');
    }

    const gsConfig = config as GoogleSheetsConfig;

    try {
      // Initialize authentication based on type
      if (gsConfig.authType === 'service-account') {
        this.auth = new google.auth.GoogleAuth({
          credentials: gsConfig.credentials,
          scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });
      } else {
        throw new AuthenticationError(
          'OAuth2 authentication not yet implemented', 
          this.name
        );
      }

      // Get authenticated client
      const authClient = await this.auth.getClient();
      
      // Initialize Sheets client
      this.sheetsClient = google.sheets({
        version: 'v4',
        auth: authClient,
      });

      // Test connection by fetching spreadsheet metadata
      const startTime = Date.now();
      const response = await this.sheetsClient.spreadsheets.get({
        spreadsheetId: gsConfig.spreadsheetId,
        fields: 'properties.title,sheets.properties',
      });

      const latency = Date.now() - startTime;

      if (!response.data) {
        throw new ConnectionError('No data received from spreadsheet', this.name);
      }

      // Get a sample of data to validate structure
      const sampleData = await this.getSampleData(5);

      return {
        success: true,
        message: `Connected to "${response.data.properties?.title || 'Unknown'}"`,
        latency,
        recordCount: sampleData.length,
        sampleData,
      };

    } catch (error) {
      if (error instanceof AuthenticationError || error instanceof ConnectionError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      throw new ConnectionError(`Failed to connect to Google Sheets: ${message}`, this.name);
    }
  }

  async fetch(query: AnalyticsQuery): Promise<AnalyticsData> {
    if (!this.sheetsClient || !this.config) {
      throw new ConnectionError('Provider not connected', this.name);
    }

    const gsConfig = this.config as GoogleSheetsConfig;

    try {
      // Determine range to fetch
      const range = this.buildRange(gsConfig, query);
      
      // Fetch data from sheets
      const response = await this.sheetsClient.spreadsheets.values.get({
        spreadsheetId: gsConfig.spreadsheetId,
        range,
        valueRenderOption: 'UNFORMATTED_VALUE',
        dateTimeRenderOption: 'FORMATTED_STRING',
      });

      if (!response.data.values) {
        return {
          records: [],
          totalCount: 0,
          lastUpdated: new Date(),
          metadata: {
            source: 'google-sheets',
            version: 'v4',
            columns: [],
          },
        };
      }

      // Transform raw data
      const transformResult = await this.transform(response.data.values);
      
      if (!transformResult.success || !transformResult.data) {
        throw new TransformationError(
          `Data transformation failed: ${transformResult.errors?.join(', ')}`,
          this.name
        );
      }

      // Apply query filters
      const filteredData = this.applyQueryFilters(transformResult.data, query);

      return filteredData;

    } catch (error) {
      if (error instanceof TransformationError || error instanceof ConnectionError) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      throw new ConnectionError(`Failed to fetch data: ${message}`, this.name);
    }
  }

  async transform(raw: unknown): Promise<TransformationResult> {
    if (!Array.isArray(raw)) {
      return {
        success: false,
        errors: ['Raw data must be an array'],
      };
    }

    if (raw.length === 0) {
      return {
        success: true,
        data: {
          records: [],
          totalCount: 0,
          lastUpdated: new Date(),
          metadata: {
            source: 'google-sheets',
            version: 'v4',
            columns: [],
          },
        },
      };
    }

    try {
      // First row contains headers
      const headers = raw[0] as string[];
      const dataRows = raw.slice(1);

      // Map column headers to expected field names
      const columnMappings = this.generateColumnMappings(headers);
      
      // Transform each row
      const records: AnalyticsRecord[] = [];
      const errors: string[] = [];

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i] as any[];
        
        try {
          const record = this.transformRow(row, headers, columnMappings, i);
          records.push(record);
        } catch (error) {
          errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      return {
        success: true,
        data: {
          records,
          totalCount: records.length,
          lastUpdated: new Date(),
          metadata: {
            source: 'google-sheets',
            version: 'v4',
            columns: headers,
            columnMappings,
          },
        },
        errors: errors.length > 0 ? errors : undefined,
        columnMappings,
      };

    } catch (error) {
      return {
        success: false,
        errors: [`Transformation failed: ${error instanceof Error ? error.message : String(error)}`],
      };
    }
  }

  async getSampleData(limit = 10): Promise<AnalyticsRecord[]> {
    if (!this.sheetsClient || !this.config) {
      return [];
    }

    const gsConfig = this.config as GoogleSheetsConfig;

    try {
      const range = `${gsConfig.sheetName || 'Sheet1'}!A1:Z${limit + 1}`;
      
      const response = await this.sheetsClient.spreadsheets.values.get({
        spreadsheetId: gsConfig.spreadsheetId,
        range,
        valueRenderOption: 'UNFORMATTED_VALUE',
      });

      if (!response.data.values) {
        return [];
      }

      const transformResult = await this.transform(response.data.values);
      return transformResult.data?.records || [];

    } catch (error) {
      console.warn('Failed to get sample data:', error);
      return [];
    }
  }

  async getAvailableColumns(): Promise<string[]> {
    if (!this.sheetsClient || !this.config) {
      return [];
    }

    const gsConfig = this.config as GoogleSheetsConfig;

    try {
      const range = `${gsConfig.sheetName || 'Sheet1'}!1:1`;
      
      const response = await this.sheetsClient.spreadsheets.values.get({
        spreadsheetId: gsConfig.spreadsheetId,
        range,
      });

      if (!response.data.values || response.data.values.length === 0) {
        return [];
      }

      return response.data.values[0] as string[];

    } catch (error) {
      console.warn('Failed to get columns:', error);
      return [];
    }
  }

  async getRecordCount(): Promise<number> {
    if (!this.sheetsClient || !this.config) {
      return 0;
    }

    const gsConfig = this.config as GoogleSheetsConfig;

    try {
      const response = await this.sheetsClient.spreadsheets.get({
        spreadsheetId: gsConfig.spreadsheetId,
        fields: 'sheets.properties',
      });

      const sheet = response.data.sheets?.find(s => 
        !gsConfig.sheetName || s.properties?.title === gsConfig.sheetName
      );

      return (sheet?.properties?.gridProperties?.rowCount || 1) - 1; // Subtract header row

    } catch (error) {
      console.warn('Failed to get record count:', error);
      return 0;
    }
  }

  private buildRange(config: GoogleSheetsConfig, query: AnalyticsQuery): string {
    if (config.range) {
      return config.range;
    }

    const sheetName = config.sheetName || 'Sheet1';
    const limit = query.limit || 1000;
    
    return `${sheetName}!A1:Z${limit + 1}`;
  }

  private generateColumnMappings(headers: string[]): Record<string, string> {
    const mappings: Record<string, string> = {};
    
    // Common field mappings
    const fieldMappings = {
      // Date fields
      'date': ['date', 'timestamp', 'day'],
      'timestamp': ['timestamp', 'date', 'time'],
      
      // Campaign fields
      'campaign_id': ['campaign_id', 'campaign id', 'campaign', 'campaignid'],
      'source': ['source', 'utm_source', 'traffic_source'],
      'medium': ['medium', 'utm_medium', 'traffic_medium'],
      
      // Metrics
      'clicks': ['clicks', 'click', 'total_clicks'],
      'impressions': ['impressions', 'impression', 'total_impressions', 'views'],
      'cost': ['cost', 'spend', 'amount', 'total_cost'],
      'conversions': ['conversions', 'conversion', 'total_conversions', 'conv'],
      'revenue': ['revenue', 'total_revenue', 'income', 'sales'],
    };

    for (const [field, variations] of Object.entries(fieldMappings)) {
      for (const header of headers) {
        const normalizedHeader = header.toLowerCase().trim();
        if (variations.includes(normalizedHeader)) {
          mappings[header] = field;
          break;
        }
      }
    }

    return mappings;
  }

  private transformRow(
    row: any[], 
    headers: string[], 
    mappings: Record<string, string>, 
    index: number
  ): AnalyticsRecord {
    const record: Partial<AnalyticsRecord> = {};

    // Map each cell to the appropriate field
    for (let i = 0; i < headers.length && i < row.length; i++) {
      const header = headers[i];
      const mappedField = mappings[header] || header.toLowerCase().replace(/\s+/g, '_');
      const value = row[i];

      switch (mappedField) {
        case 'timestamp':
        case 'date':
          record.timestamp = this.normalizeDate(value);
          break;
        case 'campaign_id':
          record.campaign_id = this.normalizeString(value);
          break;
        case 'source':
          record.source = this.normalizeString(value);
          break;
        case 'medium':
          record.medium = this.normalizeString(value);
          break;
        case 'clicks':
          record.clicks = this.normalizeNumber(value);
          break;
        case 'impressions':
          record.impressions = this.normalizeNumber(value);
          break;
        case 'cost':
          record.cost = this.normalizeNumber(value);
          break;
        case 'conversions':
          record.conversions = this.normalizeNumber(value);
          break;
        case 'revenue':
          record.revenue = this.normalizeNumber(value);
          break;
        default:
          // Store additional fields as-is
          record[mappedField] = value;
      }
    }

    // Set defaults for required fields
    record.id = this.generateRecordId(record, index);
    record.timestamp = record.timestamp || new Date();
    record.campaign_id = record.campaign_id || 'unknown';
    record.source = record.source || 'unknown';
    record.clicks = record.clicks || 0;
    record.impressions = record.impressions || 0;
    record.cost = record.cost || 0;
    record.conversions = record.conversions || 0;
    record.revenue = record.revenue || 0;

    // Validate required fields
    const validationErrors = this.validateAnalyticsRecord(record);
    if (validationErrors.length > 0) {
      throw new Error(`Invalid record: ${validationErrors.join(', ')}`);
    }

    return record as AnalyticsRecord;
  }

  private applyQueryFilters(data: AnalyticsData, query: AnalyticsQuery): AnalyticsData {
    let filteredRecords = [...data.records];

    // Apply date range filter
    if (query.dateRange) {
      filteredRecords = filteredRecords.filter(record => {
        const recordDate = new Date(record.timestamp);
        return recordDate >= query.dateRange.start && recordDate <= query.dateRange.end;
      });
    }

    // Apply general filters
    if (query.filters) {
      for (const [field, value] of Object.entries(query.filters)) {
        filteredRecords = filteredRecords.filter(record => {
          const recordValue = record[field as keyof AnalyticsRecord];
          return recordValue === value;
        });
      }
    }

    // Apply sorting
    if (query.orderBy) {
      filteredRecords.sort((a, b) => {
        const aVal = a[query.orderBy!.field as keyof AnalyticsRecord] as any;
        const bVal = b[query.orderBy!.field as keyof AnalyticsRecord] as any;
        
        if (query.orderBy!.direction === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // Apply limit and offset
    if (query.offset || query.limit) {
      const start = query.offset || 0;
      const end = query.limit ? start + query.limit : filteredRecords.length;
      filteredRecords = filteredRecords.slice(start, end);
    }

    return {
      ...data,
      records: filteredRecords,
      totalCount: filteredRecords.length,
    };
  }
}
