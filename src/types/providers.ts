/**
 * Data Provider Types
 * Interfaces and types for the data provider architecture
 */

import type {
  AnalyticsData,
  AnalyticsQuery,
  AnalyticsRecord,
} from './analytics';

// Supported data provider types
export type DataProviderType = 'supabase' | 'clickhouse' | 'api' | 'csv';

// Provider connection status
export type ConnectionStatus =
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'error';

// Base data provider configuration
export type BaseProviderConfig = {
  name: string;
  type: DataProviderType;
  enabled: boolean;
  lastTested?: Date;
  connectionStatus: ConnectionStatus;
};

// Supabase specific configuration
export type SupabaseConfig = {
  type: 'supabase';
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  schema?: string;
  table: string;
} & BaseProviderConfig;

// ClickHouse specific configuration (future)
export type ClickHouseConfig = {
  type: 'clickhouse';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  secure?: boolean;
  table: string;
} & BaseProviderConfig;

// Union type for all provider configurations
export type DataProviderConfig = SupabaseConfig | ClickHouseConfig;

// Data transformation result
export type TransformationResult = {
  success: boolean;
  data?: AnalyticsData;
  errors?: string[];
  warnings?: string[];
  columnMappings?: Record<string, string>;
};

// Provider validation result
export type ValidationResult = {
  valid: boolean;
  errors?: string[];
  suggestions?: string[];
};

// Provider connection test result
export type ConnectionTestResult = {
  success: boolean;
  message: string;
  latency?: number;
  recordCount?: number;
  sampleData?: AnalyticsRecord[];
};

// Abstract data provider interface
export type DataProvider = {
  // Provider identification
  readonly name: string;
  readonly type: DataProviderType;

  // Core functionality
  fetch(query: AnalyticsQuery): Promise<AnalyticsData>;
  transform(raw: unknown): Promise<TransformationResult>;
  validate(data: unknown): ValidationResult;

  // Connection management
  connect(config: DataProviderConfig): Promise<ConnectionTestResult>;
  disconnect(): void;
  testConnection(): Promise<ConnectionTestResult>;

  // Configuration
  configure(config: DataProviderConfig): void;
  getConfig(): DataProviderConfig | null;

  // Utility methods
  getSampleData(limit?: number): Promise<AnalyticsRecord[]>;
  getAvailableColumns(): Promise<string[]>;
  getRecordCount(): Promise<number>;
};

// Provider factory interface
export type DataProviderFactory = {
  create(config: DataProviderConfig): DataProvider;
  register(type: DataProviderType, provider: new () => DataProvider): void;
  getAvailableTypes(): DataProviderType[];
  validateConfig(config: DataProviderConfig): ValidationResult;
};

// Provider registry for managing available providers
export type ProviderRegistry = {
  providers: Map<DataProviderType, new () => DataProvider>;
  register(type: DataProviderType, provider: new () => DataProvider): void;
  unregister(type: DataProviderType): void;
  isRegistered(type: DataProviderType): boolean;
  getRegistered(): DataProviderType[];
};

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
