/**
 * Abstract Base Data Provider
 * Provides common functionality for all data provider implementations
 */

import type {
  ConnectionStatus,
  ConnectionTestResult,
  DataProvider,
  DataProviderConfig,
  DataProviderType,
  TransformationResult,
  ValidationResult,
} from '@/types/providers';
import type {
  AnalyticsData,
  AnalyticsQuery,
  AnalyticsRecord,
} from '@/types/analytics';

export abstract class BaseDataProvider implements DataProvider {
  protected config: DataProviderConfig | null = null;
  protected connectionStatus: ConnectionStatus = 'disconnected';
  protected lastError: Error | null = null;

  constructor(
    public readonly name: string,
    public readonly type: DataProviderType
  ) {}

  // Abstract methods that must be implemented by concrete providers
  abstract fetch(query: AnalyticsQuery): Promise<AnalyticsData>;
  abstract transform(raw: unknown): Promise<TransformationResult>;
  abstract connect(config: DataProviderConfig): Promise<ConnectionTestResult>;
  abstract getSampleData(limit?: number): Promise<AnalyticsRecord[]>;
  abstract getAvailableColumns(): Promise<string[]>;
  abstract getRecordCount(): Promise<number>;

  // Common implementation for all providers
  disconnect(): void {
    this.connectionStatus = 'disconnected';
    this.config = null;
    this.lastError = null;
  }

  configure(config: DataProviderConfig): void {
    if (config.type !== this.type) {
      throw new Error(
        `Invalid config type. Expected ${this.type}, got ${config.type}`
      );
    }
    this.config = config;
  }

  getConfig(): DataProviderConfig | null {
    return this.config;
  }

  async testConnection(): Promise<ConnectionTestResult> {
    if (!this.config) {
      return {
        success: false,
        message: 'Provider not configured',
      };
    }

    try {
      this.connectionStatus = 'connecting';
      const result = await this.connect(this.config);
      this.connectionStatus = result.success ? 'connected' : 'error';
      return result;
    } catch (error) {
      this.connectionStatus = 'error';
      this.lastError =
        error instanceof Error ? error : new Error(String(error));
      return {
        success: false,
        message: `Connection test failed: ${this.lastError.message}`,
      };
    }
  }

  validate(data: unknown): ValidationResult {
    if (!data) {
      return {
        valid: false,
        errors: ['Data is null or undefined'],
      };
    }

    if (typeof data !== 'object') {
      return {
        valid: false,
        errors: ['Data must be an object'],
      };
    }

    return {
      valid: true,
    };
  }

  // Helper methods for common operations
  protected normalizeDate(dateValue: unknown): Date | null {
    if (!dateValue) return null;

    if (dateValue instanceof Date) {
      // Validate the date is not invalid
      return isNaN(dateValue.getTime()) ? null : dateValue;
    }

    if (typeof dateValue === 'string') {
      // Handle empty or whitespace-only strings
      const trimmed = dateValue.trim();
      if (!trimmed) return null;

      // Try parsing various common formats
      const parsed = this.parseStringDate(trimmed);
      return parsed && !isNaN(parsed.getTime()) ? parsed : null;
    }

    if (typeof dateValue === 'number') {
      // Handle Excel serial numbers (days since 1900-01-01, but Excel incorrectly treats 1900 as a leap year)
      if (dateValue >= 1 && dateValue < 2958466) {
        // Excel serial number range (1900-01-01 to 9999-12-31)
        return this.parseExcelSerialDate(dateValue);
      }

      // Handle Unix timestamps (seconds or milliseconds)
      if (dateValue > 0) {
        // If less than year 2100 in seconds, likely a Unix timestamp in seconds
        if (dateValue < 4102444800) {
          return new Date(dateValue * 1000);
        }
        // Otherwise treat as milliseconds
        return new Date(dateValue);
      }
    }

    return null;
  }

  /**
   * Parse various string date formats commonly found in Google Sheets
   */
  private parseStringDate(dateString: string): Date | null {
    // ISO 8601 formats
    if (dateString.match(/^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}:\d{2})?/)) {
      return new Date(dateString);
    }

    // US format: MM/DD/YYYY or M/D/YYYY
    if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      return new Date(dateString);
    }

    // EU format: DD/MM/YYYY or D/M/YYYY (try parsing as EU if US parsing fails)
    if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const parts = dateString.split('/');
      const usDate = new Date(`${parts[0]}/${parts[1]}/${parts[2]}`);

      // If US parsing results in invalid date, try EU format
      if (isNaN(usDate.getTime())) {
        const euDate = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
        return isNaN(euDate.getTime()) ? null : euDate;
      }

      return usDate;
    }

    // DD-MM-YYYY or DD.MM.YYYY formats
    if (dateString.match(/^\d{1,2}[-.]\d{1,2}[-.]\d{4}$/)) {
      const parts = dateString.split(/[-.]/);
      const date = new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
      return isNaN(date.getTime()) ? null : date;
    }

    // Fallback to default parsing
    const fallback = new Date(dateString);
    return isNaN(fallback.getTime()) ? null : fallback;
  }

  /**
   * Convert Excel serial number to JavaScript Date
   * Excel uses 1900-01-01 as day 1, but incorrectly treats 1900 as a leap year
   */
  private parseExcelSerialDate(serialNumber: number): Date | null {
    if (serialNumber < 1 || serialNumber > 2958466) {
      return null; // Out of valid Excel date range
    }

    // Excel incorrectly considers 1900 a leap year, so adjust for dates after Feb 28, 1900
    const adjustedSerial = serialNumber > 59 ? serialNumber - 1 : serialNumber;

    // Start from 1899-12-30 (Excel's epoch) and add days
    const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
    const resultDate = new Date(
      excelEpoch.getTime() + adjustedSerial * 24 * 60 * 60 * 1000
    );

    return isNaN(resultDate.getTime()) ? null : resultDate;
  }

  protected normalizeNumber(value: unknown): number {
    if (typeof value === 'number') {
      return isNaN(value) ? 0 : value;
    }

    if (typeof value === 'string') {
      const parsed = parseFloat(value.replace(/[^0-9.-]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
  }

  protected normalizeString(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return '[Complex Object]';
      }
    }

    // Type-safe string conversion
    if (typeof value === 'string') {
      return value.trim();
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value).trim();
    }

    // For any other primitive types (bigint, symbol, etc.)
    if (typeof value === 'bigint' || typeof value === 'symbol') {
      return String(value).trim();
    }

    // Fallback for any remaining cases
    return '[Unknown Type]';
  }

  // Generate unique ID for records
  protected generateRecordId(
    record: Partial<AnalyticsRecord>,
    index: number
  ): string {
    const timestamp = record.timestamp?.getTime() ?? Date.now();
    const campaignId = record.campaign_id ?? 'unknown';
    const source = record.source ?? 'unknown';

    return `${this.type}-${timestamp}-${campaignId}-${source}-${index}`;
  }

  // Validate required fields in analytics record
  protected validateAnalyticsRecord(
    record: Partial<AnalyticsRecord>
  ): string[] {
    const errors: string[] = [];

    if (!record.campaign_id) {
      errors.push('Missing campaign_id');
    }

    if (!record.source) {
      errors.push('Missing source');
    }

    if (!record.timestamp) {
      errors.push('Missing timestamp');
    }

    if (typeof record.clicks !== 'number' || record.clicks < 0) {
      errors.push('Invalid clicks value');
    }

    if (typeof record.cost !== 'number' || record.cost < 0) {
      errors.push('Invalid cost value');
    }

    return errors;
  }

  // Get connection status
  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  // Get last error
  getLastError(): Error | null {
    return this.lastError;
  }

  // Check if provider is ready for use
  isReady(): boolean {
    return this.config !== null && this.connectionStatus === 'connected';
  }
}
