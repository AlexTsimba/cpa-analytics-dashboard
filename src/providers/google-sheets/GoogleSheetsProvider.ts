/**
 * Google Sheets Data Provider
 * Implements data fetching from Google Sheets using the Sheets API v4
 */

import { google } from 'googleapis';
import type { sheets_v4 } from 'googleapis';
import type { GoogleAuth } from 'google-auth-library';
import { BaseDataProvider } from '../base/BaseDataProvider';
import {
  AuthenticationError,
  ConnectionError,
  type ConnectionTestResult,
  type DataProviderConfig,
  type GoogleSheetsConfig,
  TransformationError,
  type TransformationResult,
} from '@/types/providers';
import type {
  AnalyticsData,
  AnalyticsQuery,
  AnalyticsRecord,
} from '@/types/analytics';

export class GoogleSheetsDataProvider extends BaseDataProvider {
  private sheetsClient: sheets_v4.Sheets | null = null;
  private auth: GoogleAuth | null = null;

  constructor() {
    super('Google Sheets', 'google-sheets');
  }

  async connect(config: DataProviderConfig): Promise<ConnectionTestResult> {
    if (config.type !== 'google-sheets') {
      throw new Error('Invalid config type for Google Sheets provider');
    }

    const gsConfig = config;

    try {
      // Validate configuration before attempting connection
      this.validateConfiguration(gsConfig);

      // Initialize authentication based on type
      switch (gsConfig.authType) {
        case 'service-account': {
          // Comprehensive credential validation
          const validatedCredentials =
            this.validateAndReturnServiceAccountCredentials(
              gsConfig.credentials
            );

          this.auth = new google.auth.GoogleAuth({
            credentials: validatedCredentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
          });
          break;
        }
        case 'oauth2': {
          throw new AuthenticationError(
            'OAuth2 authentication not yet implemented',
            this.name
          );
        }
        default: {
          throw new AuthenticationError(
            `Invalid authentication type: ${String(gsConfig.authType)}`,
            this.name
          );
        }
      }

      // Validate authentication client initialization
      // Note: this.auth is guaranteed to be set in the switch statement above
      const authClient = await this.validateAuthenticationClient();

      // Initialize Sheets client with validated auth
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
        throw new ConnectionError(
          'No data received from spreadsheet',
          this.name
        );
      }

      // Get a sample of data to validate structure
      const sampleData = await this.getSampleData(5);

      return {
        success: true,
        message: `Connected to "${response.data.properties?.title ?? 'Unknown'}"`,
        latency,
        recordCount: sampleData.length,
        sampleData,
      };
    } catch (error) {
      if (
        error instanceof AuthenticationError ||
        error instanceof ConnectionError
      ) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      throw new ConnectionError(
        `Failed to connect to Google Sheets: ${message}`,
        this.name
      );
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

      const responseData = response.data.values;
      if (!responseData || responseData.length === 0) {
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
      const transformResult = await this.transform(responseData);

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
      if (
        error instanceof TransformationError ||
        error instanceof ConnectionError
      ) {
        throw error;
      }

      const message = error instanceof Error ? error.message : String(error);
      throw new ConnectionError(`Failed to fetch data: ${message}`, this.name);
    }
  }

  async transform(raw: unknown): Promise<TransformationResult> {
    if (!Array.isArray(raw)) {
      return Promise.resolve({
        success: false,
        errors: ['Raw data must be an array'],
      });
    }

    if (raw.length === 0) {
      return Promise.resolve({
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
      });
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
        const row = dataRows[i] as unknown[];

        try {
          const record = this.transformRow(row, headers, columnMappings, i);
          records.push(record);
        } catch (error) {
          errors.push(
            `Row ${i + 2}: ${error instanceof Error ? error.message : String(error)}`
          );
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
        errors: errors.length > 0 ? errors : [],
        columnMappings,
      };
    } catch (error) {
      return {
        success: false,
        errors: [
          `Transformation failed: ${error instanceof Error ? error.message : String(error)}`,
        ],
      };
    }
  }

  async getSampleData(limit = 10): Promise<AnalyticsRecord[]> {
    if (!this.sheetsClient || !this.config) {
      return [];
    }

    const gsConfig = this.config as GoogleSheetsConfig;

    try {
      const range = `${gsConfig.sheetName ?? 'Sheet1'}!A1:Z${limit + 1}`;

      const response = await this.sheetsClient.spreadsheets.values.get({
        spreadsheetId: gsConfig.spreadsheetId,
        range,
        valueRenderOption: 'UNFORMATTED_VALUE',
      });

      if (!response.data.values) {
        return [];
      }

      const transformResult = await this.transform(response.data.values);
      return transformResult.data?.records ?? [];
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
      const range = `${gsConfig.sheetName ?? 'Sheet1'}!1:1`;

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

      const sheet = response.data.sheets?.find(
        (s) => !gsConfig.sheetName || s.properties?.title === gsConfig.sheetName
      );

      return (sheet?.properties?.gridProperties?.rowCount ?? 1) - 1; // Subtract header row
    } catch (error) {
      console.warn('Failed to get record count:', error);
      return 0;
    }
  }

  /**
   * Validates the configuration object for required fields and proper structure
   */
  private validateConfiguration(config: GoogleSheetsConfig): void {
    if (!config.spreadsheetId || typeof config.spreadsheetId !== 'string') {
      throw new AuthenticationError(
        'Valid spreadsheetId is required in configuration',
        this.name
      );
    }

    if (!config.authType || typeof config.authType !== 'string') {
      throw new AuthenticationError(
        'Authentication type is required in configuration',
        this.name
      );
    }

    // Validate spreadsheet ID format (Google Sheets IDs are alphanumeric with specific patterns)
    const spreadsheetIdPattern = /^[a-zA-Z0-9-_]+$/;
    if (!spreadsheetIdPattern.test(config.spreadsheetId)) {
      throw new AuthenticationError('Invalid spreadsheet ID format', this.name);
    }
  }

  /**
   * Validates and returns service account credentials with proper typing
   */
  private validateAndReturnServiceAccountCredentials(
    credentials: GoogleSheetsConfig['credentials']
  ): NonNullable<GoogleSheetsConfig['credentials']> {
    if (!credentials) {
      throw new AuthenticationError(
        'Service account credentials are required',
        this.name
      );
    }

    // Validate credential type
    if (credentials.type !== 'service_account') {
      throw new AuthenticationError(
        'Credential type must be "service_account"',
        this.name
      );
    }

    // Required fields for service account credentials
    const requiredFields = [
      'project_id',
      'private_key_id',
      'private_key',
      'client_email',
      'client_id',
      'auth_uri',
      'token_uri',
    ] as const;

    const missingFields: string[] = [];

    for (const field of requiredFields) {
      if (!credentials[field] || typeof credentials[field] !== 'string') {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      throw new AuthenticationError(
        `Missing required credential fields: ${missingFields.join(', ')}`,
        this.name
      );
    }

    // Validate email format for service account
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(credentials.client_email)) {
      throw new AuthenticationError(
        'Invalid service account email format',
        this.name
      );
    }

    // Validate private key format
    if (!credentials.private_key.includes('-----BEGIN PRIVATE KEY-----')) {
      throw new AuthenticationError(
        'Invalid private key format - must be a valid PEM private key',
        this.name
      );
    }

    // Validate URI formats
    const uriPattern = /^https:\/\/.+/;
    if (!uriPattern.test(credentials.auth_uri)) {
      throw new AuthenticationError(
        'Invalid auth_uri format - must be a valid HTTPS URL',
        this.name
      );
    }

    if (!uriPattern.test(credentials.token_uri)) {
      throw new AuthenticationError(
        'Invalid token_uri format - must be a valid HTTPS URL',
        this.name
      );
    }

    return credentials;
  }

  /**
   * Validates that the authentication client can be created and is functional
   */
  private async validateAuthenticationClient(): Promise<GoogleAuth> {
    if (!this.auth) {
      throw new AuthenticationError(
        'Authentication client not initialized',
        this.name
      );
    }

    try {
      // Test that we can get a client from the auth instance
      const authClient = await this.auth.getClient();
      if (!authClient) {
        throw new AuthenticationError(
          'Failed to obtain authentication client',
          this.name
        );
      }

      // Test that we can get project ID
      const projectId = await this.auth.getProjectId();
      if (!projectId) {
        throw new AuthenticationError(
          'Failed to obtain project ID from credentials',
          this.name
        );
      }

      return this.auth;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new AuthenticationError(
        `Authentication validation failed: ${message}`,
        this.name
      );
    }
  }

  private buildRange(
    config: GoogleSheetsConfig,
    query: AnalyticsQuery
  ): string {
    if (config.range) {
      return config.range;
    }

    const sheetName = config.sheetName ?? 'Sheet1';
    const limit = query.limit ?? 1000;

    return `${sheetName}!A1:Z${limit + 1}`;
  }

  private generateColumnMappings(headers: string[]): Record<string, string> {
    const mappings: Record<string, string> = {};

    // Common field mappings
    const fieldMappings = {
      // Date fields
      date: ['date', 'timestamp', 'day'],
      timestamp: ['timestamp', 'date', 'time'],

      // Campaign fields
      campaign_id: ['campaign_id', 'campaign id', 'campaign', 'campaignid'],
      source: ['source', 'utm_source', 'traffic_source'],
      medium: ['medium', 'utm_medium', 'traffic_medium'],

      // Metrics
      clicks: ['clicks', 'click', 'total_clicks'],
      impressions: ['impressions', 'impression', 'total_impressions', 'views'],
      cost: ['cost', 'spend', 'amount', 'total_cost'],
      conversions: ['conversions', 'conversion', 'total_conversions', 'conv'],
      revenue: ['revenue', 'total_revenue', 'income', 'sales'],
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
    row: unknown[],
    headers: string[],
    mappings: Record<string, string>,
    index: number
  ): AnalyticsRecord {
    const record: Partial<AnalyticsRecord> = {};

    // Map each cell to the appropriate field
    for (let i = 0; i < headers.length && i < row.length; i++) {
      const header = headers[i];
      if (!header) continue; // Skip undefined headers

      const mappedField =
        mappings[header] ?? header.toLowerCase().replace(/\s+/g, '_');
      const value = row[i];

      switch (mappedField) {
        case 'timestamp':
        case 'date': {
          const normalizedDate = this.normalizeGoogleSheetsDate(value);
          if (normalizedDate) {
            record.timestamp = normalizedDate;
          }
          break;
        }
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
    record.timestamp = record.timestamp ?? new Date();
    record.campaign_id = record.campaign_id ?? 'unknown';
    record.source = record.source ?? 'unknown';
    record.clicks = record.clicks ?? 0;
    record.impressions = record.impressions ?? 0;
    record.cost = record.cost ?? 0;
    record.conversions = record.conversions ?? 0;
    record.revenue = record.revenue ?? 0;

    // Validate required fields
    const validationErrors = this.validateAnalyticsRecord(record);
    if (validationErrors.length > 0) {
      throw new Error(`Invalid record: ${validationErrors.join(', ')}`);
    }

    return record as AnalyticsRecord;
  }

  private applyQueryFilters(
    data: AnalyticsData,
    query: AnalyticsQuery
  ): AnalyticsData {
    let filteredRecords = [...data.records];

    // Apply date range filter
    if (query.dateRange) {
      filteredRecords = filteredRecords.filter((record) => {
        const recordDate = new Date(record.timestamp);
        return (
          recordDate >= query.dateRange.start &&
          recordDate <= query.dateRange.end
        );
      });
    }

    // Apply general filters
    if (query.filters) {
      for (const [field, value] of Object.entries(query.filters)) {
        filteredRecords = filteredRecords.filter((record) => {
          const recordValue = record[field as keyof AnalyticsRecord];
          return recordValue === value;
        });
      }
    }

    // Apply sorting
    if (query.orderBy) {
      const orderByField = query.orderBy.field as keyof AnalyticsRecord;
      const direction = query.orderBy.direction;

      filteredRecords.sort((a, b) => {
        const aVal = a[orderByField] as string | number;
        const bVal = b[orderByField] as string | number;

        if (direction === 'desc') {
          return bVal > aVal ? 1 : -1;
        }
        return aVal > bVal ? 1 : -1;
      });
    }

    // Apply limit and offset
    if (query.offset || query.limit) {
      const start = query.offset ?? 0;
      const end = query.limit ? start + query.limit : filteredRecords.length;
      filteredRecords = filteredRecords.slice(start, end);
    }

    return {
      ...data,
      records: filteredRecords,
      totalCount: filteredRecords.length,
    };
  }

  /**
   * Enhanced date normalization for Google Sheets specific formats
   * Handles various formats that can come from Google Sheets API responses
   */
  private normalizeGoogleSheetsDate(dateValue: unknown): Date | null {
    if (!dateValue) return null;

    // Handle Google Sheets FORMATTED_STRING responses
    if (typeof dateValue === 'string') {
      const trimmed = dateValue.trim();

      // Google Sheets often returns dates in specific formats
      // Handle common Google Sheets date formats
      const gsFormats = [
        /^\d{1,2}\/\d{1,2}\/\d{4}$/, // M/D/YYYY or MM/DD/YYYY
        /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
        /^\d{1,2}-\d{1,2}-\d{4}$/, // M-D-YYYY or MM-DD-YYYY
        /^\d{1,2}\.\d{1,2}\.\d{4}$/, // M.D.YYYY or MM.DD.YYYY
      ];

      // Try specific Google Sheets formats first
      for (const format of gsFormats) {
        if (format.test(trimmed)) {
          const parsed = new Date(trimmed);
          if (!isNaN(parsed.getTime())) {
            return this.validateDateRange(parsed);
          }
        }
      }
    }

    // Fall back to base class normalization for other formats
    const baseResult = this.normalizeDate(dateValue);
    return baseResult ? this.validateDateRange(baseResult) : null;
  }

  /**
   * Validate that the date is within a reasonable range for analytics data
   * Prevents invalid dates that could cause runtime errors
   */
  private validateDateRange(date: Date): Date | null {
    if (isNaN(date.getTime())) {
      return null;
    }

    // Ensure date is within reasonable range for analytics data
    const minDate = new Date('1990-01-01');
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 10); // Allow future dates up to 10 years

    if (date < minDate || date > maxDate) {
      console.warn(
        `Date ${date.toISOString()} is outside reasonable range for analytics data`
      );
      return null;
    }

    return date;
  }
}
