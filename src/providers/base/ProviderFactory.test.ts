/**
 * Provider Factory Tests
 * Tests for the data provider registry and factory
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  DataProviderRegistryImpl,
  DataProviderFactoryImpl,
} from './ProviderFactory';
import type { PostgreSQLConfig, DataProvider } from '@/types/providers';

// Mock PostgreSQL provider for testing
class MockPostgreSQLProvider implements DataProvider {
  readonly name = 'PostgreSQL';
  readonly type = 'postgresql' as const;

  async fetch(): Promise<any> {
    return {};
  }
  async transform(): Promise<any> {
    return {
      success: true,
      data: {
        records: [],
        totalCount: 0,
        lastUpdated: new Date(),
        metadata: {
          source: 'test',
          version: '1.0',
          columns: [],
          columnMappings: {},
        },
      },
      errors: [],
    };
  }
  validate(): any {
    return { valid: true, errors: [] };
  }
  async connect(): Promise<any> {
    return { success: true, message: 'Connected' };
  }
  disconnect() {
    return;
  }
  async testConnection(): Promise<any> {
    return { success: true, message: 'Connected' };
  }
  configure() {
    return;
  }
  getConfig() {
    return null;
  }
  async getSampleData() {
    return [];
  }
  async getAvailableColumns() {
    return [];
  }
  async getRecordCount() {
    return 0;
  }
}

// Mock ClickHouse provider for testing
class MockClickHouseProvider implements DataProvider {
  readonly name = 'ClickHouse';
  readonly type = 'clickhouse' as const;

  async fetch(): Promise<any> {
    return {};
  }
  async transform(): Promise<any> {
    return {
      success: true,
      data: {
        records: [],
        totalCount: 0,
        lastUpdated: new Date(),
        metadata: {
          source: 'test',
          version: '1.0',
          columns: [],
          columnMappings: {},
        },
      },
      errors: [],
    };
  }
  validate(): any {
    return { valid: true, errors: [] };
  }
  async connect(): Promise<any> {
    return { success: true, message: 'Connected' };
  }
  disconnect() {
    return;
  }
  async testConnection(): Promise<any> {
    return { success: true, message: 'Connected' };
  }
  configure() {
    return;
  }
  getConfig() {
    return null;
  }
  async getSampleData() {
    return [];
  }
  async getAvailableColumns() {
    return [];
  }
  async getRecordCount() {
    return 0;
  }
}

describe('DataProviderRegistryImpl', () => {
  let registry: DataProviderRegistryImpl;

  beforeEach(() => {
    registry = new DataProviderRegistryImpl();
  });

  describe('register', () => {
    it('should register a provider', () => {
      registry.register('postgresql', MockPostgreSQLProvider);

      expect(registry.isRegistered('postgresql')).toBe(true);
      expect(registry.getRegistered()).toContain('postgresql');
    });

    it('should allow multiple providers', () => {
      registry.register('postgresql', MockPostgreSQLProvider);
      registry.register('clickhouse', MockClickHouseProvider);

      expect(registry.getRegistered()).toHaveLength(2);
      expect(registry.getRegistered()).toContain('postgresql');
      expect(registry.getRegistered()).toContain('clickhouse');
    });
  });

  describe('unregister', () => {
    it('should unregister a provider', () => {
      registry.register('postgresql', MockPostgreSQLProvider);
      expect(registry.isRegistered('postgresql')).toBe(true);

      registry.unregister('postgresql');
      expect(registry.isRegistered('postgresql')).toBe(false);
      expect(registry.getRegistered()).not.toContain('postgresql');
    });

    it('should handle unregistering non-existent provider', () => {
      expect(() => registry.unregister('non-existent' as any)).not.toThrow();
    });
  });

  describe('isRegistered', () => {
    it('should return false for unregistered provider', () => {
      expect(registry.isRegistered('postgresql')).toBe(false);
    });

    it('should return true for registered provider', () => {
      registry.register('postgresql', MockPostgreSQLProvider);
      expect(registry.isRegistered('postgresql')).toBe(true);
    });
  });

  describe('getRegistered', () => {
    it('should return empty array initially', () => {
      expect(registry.getRegistered()).toEqual([]);
    });

    it('should return registered provider types', () => {
      registry.register('postgresql', MockPostgreSQLProvider);
      expect(registry.getRegistered()).toEqual(['postgresql']);
    });
  });
});

describe('DataProviderFactoryImpl', () => {
  let registry: DataProviderRegistryImpl;
  let factory: DataProviderFactoryImpl;

  const mockPostgreSQLConfig: PostgreSQLConfig = {
    name: 'Test PostgreSQL',
    type: 'postgresql',
    enabled: true,
    connectionStatus: 'disconnected',
    host: 'test-cluster.db.ondigitalocean.com',
    port: 5432,
    database: 'cpa_analytics',
    username: 'test_user',
    password: 'test_password',
    ssl: true,
    table: 'players',
    schema: 'public',
  };

  beforeEach(() => {
    registry = new DataProviderRegistryImpl();
    factory = new DataProviderFactoryImpl(registry);
  });

  describe('create', () => {
    it('should create a provider instance', () => {
      factory.register('postgresql', MockPostgreSQLProvider);

      const provider = factory.create(mockPostgreSQLConfig);

      expect(provider).toBeInstanceOf(MockPostgreSQLProvider);
      expect(provider.name).toBe('PostgreSQL');
      expect(provider.type).toBe('postgresql');
    });

    it('should throw error for unregistered provider type', () => {
      expect(() => factory.create(mockPostgreSQLConfig)).toThrow(
        "Provider type 'postgresql' is not registered"
      );
    });
  });

  describe('register', () => {
    it('should register provider in underlying registry', () => {
      factory.register('postgresql', MockPostgreSQLProvider);

      expect(registry.isRegistered('postgresql')).toBe(true);
      expect(factory.getAvailableTypes()).toContain('postgresql');
    });
  });

  describe('getAvailableTypes', () => {
    it('should return empty array initially', () => {
      expect(factory.getAvailableTypes()).toEqual([]);
    });

    it('should return registered types', () => {
      factory.register('postgresql', MockPostgreSQLProvider);
      expect(factory.getAvailableTypes()).toEqual(['postgresql']);
    });
  });

  describe('validateConfig', () => {
    beforeEach(() => {
      factory.register('postgresql', MockPostgreSQLProvider);
      factory.register('clickhouse', MockClickHouseProvider);
    });

    it('should validate valid PostgreSQL config', () => {
      const result = factory.validateConfig(mockPostgreSQLConfig);

      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should return error for missing provider type', () => {
      const invalidConfig = {} as any; // Config without type

      const result = factory.validateConfig(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Provider type is required');
    });

    it('should return error for unregistered provider type', () => {
      const invalidConfig = {
        ...mockPostgreSQLConfig,
        type: 'non-existent' as any,
      };

      const result = factory.validateConfig(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Provider type 'non-existent' is not registered"
      );
      expect(result.suggestions).toContain(
        'Available types: postgresql, clickhouse'
      );
    });

    it('should validate PostgreSQL specific fields', () => {
      const invalidConfig = {
        ...mockPostgreSQLConfig,
        host: '', // Empty host
        database: '', // Empty database
        username: '', // Empty username
        password: '', // Empty password
        table: '', // Empty table
      };

      const result = factory.validateConfig(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('PostgreSQL host is required');
      expect(result.errors).toContain('Database name is required');
      expect(result.errors).toContain('Username is required');
      expect(result.errors).toContain('Password is required');
      expect(result.errors).toContain('Table name is required');
    });

    it('should validate ClickHouse config fields (future)', () => {
      const clickhouseConfig = {
        name: 'Test ClickHouse',
        type: 'clickhouse' as const,
        enabled: true,
        connectionStatus: 'disconnected' as const,
        host: '', // Empty host
        port: 8123,
        database: '', // Empty database
        username: 'default',
        password: '',
        table: '', // Empty table
      };

      const result = factory.validateConfig(clickhouseConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Host is required');
      expect(result.errors).toContain('Database is required');
      expect(result.errors).toContain('Table is required');
    });
  });
});
