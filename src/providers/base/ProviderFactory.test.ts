/**
 * Provider Factory Tests
 * Tests for the data provider registry and factory
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  DataProviderRegistryImpl,
  DataProviderFactoryImpl,
} from './ProviderFactory';
import type { SupabaseConfig, DataProvider } from '@/types/providers';

// Mock Supabase provider for testing
class MockSupabaseProvider implements DataProvider {
  readonly name = 'Supabase';
  readonly type = 'supabase' as const;

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
      registry.register('supabase', MockSupabaseProvider);

      expect(registry.isRegistered('supabase')).toBe(true);
      expect(registry.getRegistered()).toContain('supabase');
    });

    it('should allow multiple providers', () => {
      registry.register('supabase', MockSupabaseProvider);
      registry.register('clickhouse', MockClickHouseProvider);

      expect(registry.getRegistered()).toHaveLength(2);
      expect(registry.getRegistered()).toContain('supabase');
      expect(registry.getRegistered()).toContain('clickhouse');
    });
  });

  describe('unregister', () => {
    it('should unregister a provider', () => {
      registry.register('supabase', MockSupabaseProvider);
      expect(registry.isRegistered('supabase')).toBe(true);

      registry.unregister('supabase');
      expect(registry.isRegistered('supabase')).toBe(false);
      expect(registry.getRegistered()).not.toContain('supabase');
    });

    it('should handle unregistering non-existent provider', () => {
      expect(() => registry.unregister('non-existent' as any)).not.toThrow();
    });
  });

  describe('isRegistered', () => {
    it('should return false for unregistered provider', () => {
      expect(registry.isRegistered('supabase')).toBe(false);
    });

    it('should return true for registered provider', () => {
      registry.register('supabase', MockSupabaseProvider);
      expect(registry.isRegistered('supabase')).toBe(true);
    });
  });

  describe('getRegistered', () => {
    it('should return empty array initially', () => {
      expect(registry.getRegistered()).toEqual([]);
    });

    it('should return registered provider types', () => {
      registry.register('supabase', MockSupabaseProvider);
      expect(registry.getRegistered()).toEqual(['supabase']);
    });
  });
});

describe('DataProviderFactoryImpl', () => {
  let registry: DataProviderRegistryImpl;
  let factory: DataProviderFactoryImpl;

  const mockSupabaseConfig: SupabaseConfig = {
    name: 'Test Supabase',
    type: 'supabase',
    enabled: true,
    connectionStatus: 'disconnected',
    url: 'https://test-project.supabase.co',
    anonKey: 'test-anon-key',
    table: 'analytics_records',
    schema: 'public',
  };

  beforeEach(() => {
    registry = new DataProviderRegistryImpl();
    factory = new DataProviderFactoryImpl(registry);
  });

  describe('create', () => {
    it('should create a provider instance', () => {
      factory.register('supabase', MockSupabaseProvider);

      const provider = factory.create(mockSupabaseConfig);

      expect(provider).toBeInstanceOf(MockSupabaseProvider);
      expect(provider.name).toBe('Supabase');
      expect(provider.type).toBe('supabase');
    });

    it('should throw error for unregistered provider type', () => {
      expect(() => factory.create(mockSupabaseConfig)).toThrow(
        "Provider type 'supabase' is not registered"
      );
    });
  });

  describe('register', () => {
    it('should register provider in underlying registry', () => {
      factory.register('supabase', MockSupabaseProvider);

      expect(registry.isRegistered('supabase')).toBe(true);
      expect(factory.getAvailableTypes()).toContain('supabase');
    });
  });

  describe('getAvailableTypes', () => {
    it('should return empty array initially', () => {
      expect(factory.getAvailableTypes()).toEqual([]);
    });

    it('should return registered types', () => {
      factory.register('supabase', MockSupabaseProvider);
      expect(factory.getAvailableTypes()).toEqual(['supabase']);
    });
  });

  describe('validateConfig', () => {
    beforeEach(() => {
      factory.register('supabase', MockSupabaseProvider);
      factory.register('clickhouse', MockClickHouseProvider);
    });

    it('should validate valid Supabase config', () => {
      const result = factory.validateConfig(mockSupabaseConfig);

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
        ...mockSupabaseConfig,
        type: 'non-existent' as any,
      };

      const result = factory.validateConfig(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain(
        "Provider type 'non-existent' is not registered"
      );
      expect(result.suggestions).toContain(
        'Available types: supabase, clickhouse'
      );
    });

    it('should validate Supabase specific fields', () => {
      const invalidConfig = {
        ...mockSupabaseConfig,
        url: '', // Empty URL
        anonKey: '', // Empty anon key
        table: '', // Empty table
      };

      const result = factory.validateConfig(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Supabase URL is required');
      expect(result.errors).toContain('Supabase anonymous key is required');
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
