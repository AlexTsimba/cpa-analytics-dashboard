/**
 * Data Provider Types
 * Interfaces and types for the data provider architecture
 */

import type { AnalyticsData, AnalyticsQuery, AnalyticsRecord } from './analytics';

// Supported data provider types
export type DataProviderType = 'google-sheets' | 'clickhouse' | 'api' | 'csv';

// Provider connection status
export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

// Base data provider configuration
export interface BaseProviderConfig {
  name: string;
  type: DataProviderType;
  enabled: boolean;
  lastTested?: Date;
  connectionStatus: ConnectionStatus;
}

// Google Sheets specific configuration
export interface GoogleSheetsConfig extends BaseProviderConfig {
  type: 'google-sheets';
  spreadsheetId: string;
  sheetName?: string;
  range?: string;
  authType: 'service-account' | 'oauth2';
  credentials?: {
    type: 'service_account';
    project_id: string;
    private_key_id: string;
    private_key: string;
    client_email: string;
    client_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_x509_cert_url: string;
  };
  refreshInterval?: number; // minutes
}

// ClickHouse specific configuration (future)
export interface ClickHouseConfig extends BaseProviderConfig {
  type: 'clickhouse';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  secure?: boolean;
  table: string;
}

// Union type for all provider configurations
export type DataProviderConfig = GoogleSheetsConfig | ClickHouseConfig;

// Data transformation result
export interface TransformationResult {
  success: boolean;
  data?: AnalyticsData;
  errors?: string[];
  warnings?: string[];
  columnMappings?: Record<string, string>;
}

// Provider validation result
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  suggestions?: string[];
}

// Provider connection test result
export interface ConnectionTestResult {
  success: boolean;
  message: string;
  latency?: number;
  recordCount?: number;
  sampleData?: AnalyticsRecord[];
}

// Abstract data provider interface
export interface DataProvider {
  // Provider identification
  readonly name: string;
  readonly type: DataProviderType;
  
  // Core functionality
  fetch(query: AnalyticsQuery): Promise<AnalyticsData>;
  transform(raw: unknown): Promise<TransformationResult>;
  validate(data: unknown): Promise<ValidationResult>;
  
  // Connection management
  connect(config: DataProviderConfig): Promise<ConnectionTestResult>;
  disconnect(): Promise<void>;
  testConnection(): Promise<ConnectionTestResult>;
  
  // Configuration
  configure(config: DataProviderConfig): void;
  getConfig(): DataProviderConfig | null;
  
  // Utility methods
  getSampleData(limit?: number): Promise<AnalyticsRecord[]>;
  getAvailableColumns(): Promise<string[]>;
  getRecordCount(): Promise<number>;
}

// Provider factory interface
export interface DataProviderFactory {
  create(config: DataProviderConfig): DataProvider;
  register(type: DataProviderType, provider: new () => DataProvider): void;
  getAvailableTypes(): DataProviderType[];
  validateConfig(config: DataProviderConfig): ValidationResult;
}

// Provider registry for managing available providers
export interface ProviderRegistry {
  providers: Map<DataProviderType, new () => DataProvider>;
  register(type: DataProviderType, provider: new () => DataProvider): void;
  unregister(type: DataProviderType): void;
  isRegistered(type: DataProviderType): boolean;
  getRegistered(): DataProviderType[];
}

// Provider error types
export class DataProviderError extends Error {
  constructor(
    message: string,
    public code: string,
    public provider: string,
    public recoverable: boolean = false
  ) {
    super(message);
    this.name = 'DataProviderError';
  }
}

export class ConnectionError extends DataProviderError {
  constructor(message: string, provider: string) {
    super(message, 'CONNECTION_ERROR', provider, true);
    this.name = 'ConnectionError';
  }
}

export class AuthenticationError extends DataProviderError {
  constructor(message: string, provider: string) {
    super(message, 'AUTH_ERROR', provider, false);
    this.name = 'AuthenticationError';
  }
}

export class TransformationError extends DataProviderError {
  constructor(message: string, provider: string) {
    super(message, 'TRANSFORM_ERROR', provider, true);
    this.name = 'TransformationError';
  }
}

export class ValidationError extends DataProviderError {
  constructor(message: string, provider: string) {
    super(message, 'VALIDATION_ERROR', provider, false);
    this.name = 'ValidationError';
  }
}
