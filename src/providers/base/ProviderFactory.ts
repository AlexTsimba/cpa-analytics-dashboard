/**
 * Provider Registry and Factory Implementation
 * Manages registration and creation of data providers
 */

import type {
  DataProvider,
  DataProviderType,
  DataProviderConfig,
  DataProviderFactory,
  ProviderRegistry,
  ValidationResult
} from '@/types/providers';

export class DataProviderRegistryImpl implements ProviderRegistry {
  public providers = new Map<DataProviderType, new () => DataProvider>();

  register(type: DataProviderType, provider: new () => DataProvider): void {
    this.providers.set(type, provider);
  }

  unregister(type: DataProviderType): void {
    this.providers.delete(type);
  }

  isRegistered(type: DataProviderType): boolean {
    return this.providers.has(type);
  }

  getRegistered(): DataProviderType[] {
    return Array.from(this.providers.keys());
  }
}

export class DataProviderFactoryImpl implements DataProviderFactory {
  constructor(private registry: ProviderRegistry) {}

  create(config: DataProviderConfig): DataProvider {
    const ProviderClass = this.registry.providers.get(config.type);
    if (!ProviderClass) {
      throw new Error(`Provider type '${config.type}' is not registered`);
    }

    const provider = new ProviderClass();
    provider.configure(config);
    return provider;
  }

  register(type: DataProviderType, provider: new () => DataProvider): void {
    this.registry.register(type, provider);
  }

  getAvailableTypes(): DataProviderType[] {
    return this.registry.getRegistered();
  }

  validateConfig(config: DataProviderConfig): ValidationResult {
    if (!config.type) {
      return {
        valid: false,
        errors: ['Provider type is required']
      };
    }

    if (!this.registry.isRegistered(config.type)) {
      return {
        valid: false,
        errors: [`Provider type '${config.type}' is not registered`],
        suggestions: [`Available types: ${this.getAvailableTypes().join(', ')}`]
      };
    }

    // Type-specific validation
    switch (config.type) {
      case 'google-sheets':
        return this.validateGoogleSheetsConfig(config);
      case 'clickhouse':
        return this.validateClickHouseConfig(config);
      default:
        return { valid: true };
    }
  }

  private validateGoogleSheetsConfig(config: DataProviderConfig): ValidationResult {
    if (config.type !== 'google-sheets') {
      return { valid: false, errors: ['Invalid config type'] };
    }

    const errors: string[] = [];
    
    if (!config.spreadsheetId) {
      errors.push('Spreadsheet ID is required');
    }

    if (!config.authType) {
      errors.push('Authentication type is required');
    }

    if (config.authType === 'service-account' && !config.credentials) {
      errors.push('Service account credentials are required');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private validateClickHouseConfig(config: DataProviderConfig): ValidationResult {
    if (config.type !== 'clickhouse') {
      return { valid: false, errors: ['Invalid config type'] };
    }

    const chConfig = config as any; // Cast to any since ClickHouseConfig is future
    const errors: string[] = [];
    
    if (!chConfig.host) {
      errors.push('Host is required');
    }

    if (!chConfig.database) {
      errors.push('Database is required');
    }

    if (!chConfig.table) {
      errors.push('Table is required');
    }

    return {
      valid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}

// Singleton registry and factory instances
export const providerRegistry = new DataProviderRegistryImpl();
export const dataProviderFactory = new DataProviderFactoryImpl(providerRegistry);
