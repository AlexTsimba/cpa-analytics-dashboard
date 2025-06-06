/**
 * Provider Registry and Factory Implementation
 * Manages registration and creation of data providers
 */

import type {
  ClickHouseConfig as _ClickHouseConfig,
  DataProvider,
  DataProviderConfig,
  DataProviderFactory,
  DataProviderType,
  ProviderRegistry,
  ValidationResult,
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

  validateConfig(config: unknown): ValidationResult {
    // Check if config exists
    if (!config || typeof config !== 'object') {
      return {
        valid: false,
        errors: ['Configuration is required'],
      };
    }

    const configObj = config as Record<string, unknown>;

    // Check if type exists
    if (!configObj['type']) {
      return {
        valid: false,
        errors: ['Provider type is required'],
      };
    }

    const typedConfig = config as DataProviderConfig;

    // Check if provider type is registered
    if (!this.registry.isRegistered(typedConfig.type)) {
      return {
        valid: false,
        errors: [`Provider type '${typedConfig.type}' is not registered`],
        suggestions: [
          `Available types: ${this.getAvailableTypes().join(', ')}`,
        ],
      };
    }

    // Type-specific validation
    switch (typedConfig.type) {
      case 'supabase':
        return this.validateSupabaseConfig(configObj);
      case 'clickhouse':
        return this.validateClickHouseConfig(configObj);
      default:
        return { valid: true };
    }
  }

  private validateSupabaseConfig(
    config: Record<string, unknown>
  ): ValidationResult {
    if (config['type'] !== 'supabase') {
      return { valid: false, errors: ['Invalid config type'] };
    }

    const errors: string[] = [];

    if (!config['url']) {
      errors.push('Supabase URL is required');
    }

    if (!config['anonKey']) {
      errors.push('Supabase anonymous key is required');
    }

    if (!config['table']) {
      errors.push('Table name is required');
    }

    if (errors.length > 0) {
      return {
        valid: false,
        errors,
      };
    }

    return {
      valid: true,
    };
  }

  private validateClickHouseConfig(
    config: Record<string, unknown>
  ): ValidationResult {
    if (config['type'] !== 'clickhouse') {
      return { valid: false, errors: ['Invalid config type'] };
    }

    const errors: string[] = [];

    if (!config['host']) {
      errors.push('Host is required');
    }

    if (!config['database']) {
      errors.push('Database is required');
    }

    if (!config['table']) {
      errors.push('Table is required');
    }

    if (errors.length > 0) {
      return {
        valid: false,
        errors,
      };
    }

    return {
      valid: true,
    };
  }
}

// Singleton registry and factory instances
export const providerRegistry = new DataProviderRegistryImpl();
export const dataProviderFactory = new DataProviderFactoryImpl(
  providerRegistry
);
