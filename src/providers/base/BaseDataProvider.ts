/**
 * Abstract Base Data Provider
 * Provides common functionality for all data provider implementations
 */

import type {
  DataProvider,
  DataProviderConfig,
  DataProviderType,
  ConnectionTestResult,
  ValidationResult,
  TransformationResult,
  ConnectionStatus,
} from '@/types/providers';
import type { AnalyticsData, AnalyticsQuery, AnalyticsRecord } from '@/types/analytics';

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
  async disconnect(): Promise<void> {
    this.connectionStatus = 'disconnected';
    this.config = null;
    this.lastError = null;
  }

  configure(config: DataProviderConfig): void {
    if (config.type !== this.type) {
      throw new Error(`Invalid config type. Expected ${this.type}, got ${config.type}`);
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
        message: 'Provider not configured'
      };
    }

    try {
      this.connectionStatus = 'connecting';
      const result = await this.connect(this.config);
      this.connectionStatus = result.success ? 'connected' : 'error';
      return result;
    } catch (error) {
      this.connectionStatus = 'error';
      this.lastError = error instanceof Error ? error : new Error(String(error));
      return {
        success: false,
        message: `Connection test failed: ${this.lastError.message}`
      };
    }
  }

  // Basic validation implementation
  async validate(data: unknown): Promise<ValidationResult> {
    if (!data) {
      return {
        valid: false,
        errors: ['Data is null or undefined']
      };
    }

    if (typeof data !== 'object') {
      return {
        valid: false,
        errors: ['Data must be an object']
      };
    }

    return {
      valid: true
    };
  }

  // Helper methods for common operations
  protected normalizeDate(dateValue: unknown): Date | null {
    if (!dateValue) return null;
    
    if (dateValue instanceof Date) {
      return dateValue;
    }
    
    if (typeof dateValue === 'string') {
      const parsed = new Date(dateValue);
      return isNaN(parsed.getTime()) ? null : parsed;
    }
    
    if (typeof dateValue === 'number') {
      return new Date(dateValue);
    }
    
    return null;
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
    
    return String(value).trim();
  }

  // Generate unique ID for records
  protected generateRecordId(record: Partial<AnalyticsRecord>, index: number): string {
    const timestamp = record.timestamp?.getTime() || Date.now();
    const campaignId = record.campaign_id || 'unknown';
    const source = record.source || 'unknown';
    
    return `${this.type}-${timestamp}-${campaignId}-${source}-${index}`;
  }

  // Validate required fields in analytics record
  protected validateAnalyticsRecord(record: Partial<AnalyticsRecord>): string[] {
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
