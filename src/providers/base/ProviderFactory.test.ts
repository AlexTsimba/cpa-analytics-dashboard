/**
 * Provider Factory Tests
 * Tests for the data provider registry and factory
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  DataProviderRegistryImpl,
  DataProviderFactoryImpl,
} from './ProviderFactory';
import { GoogleSheetsDataProvider } from '../google-sheets/GoogleSheetsProvider';
import type { GoogleSheetsConfig, DataProvider } from '@/types/providers';

describe('DataProviderRegistryImpl', () => {
  let registry: DataProviderRegistryImpl;

  beforeEach(() => {
    registry = new DataProviderRegistryImpl();
  });

  describe('register', () => {
    it('should register a provider', () => {
      registry.register('google-sheets', GoogleSheetsDataProvider);

      expect(registry.isRegistered('google-sheets')).toBe(true);
      expect(registry.getRegistered()).toContain('google-sheets');
    });

    it('should allow multiple providers', () => {
      registry.register('google-sheets', GoogleSheetsDataProvider);
      
      class MockClickHouseProvider implements DataProvider {
        readonly name = 'ClickHouse';
        readonly type = 'clickhouse' as const;
        
        async fetch() { throw new Error('Not implemented'); }
        async transform() { throw new Error('Not implemented'); }
        async validate() { throw new Error('Not implemented'); }
        async connect() { throw new Error('Not implemented'); }
        async disconnect() { return; }
        async testConnection() { throw new Error('Not implemented'); }
        configure() { return; }
        getConfig() { return null; }
        async getSampleData() { return []; }
        async getAvailableColumns() { return []; }
        async getRecordCount() { return 0; }
      }

      registry.register('clickhouse', MockClickHouseProvider);

      expect(registry.getRegistered()).toHaveLength(2);
      expect(registry.getRegistered()).toContain('google-sheets');
      expect(registry.getRegistered()).toContain('clickhouse');
    });
  });

  describe('unregister', () => {
    it('should unregister a provider', () => {
      registry.register('google-sheets', GoogleSheetsDataProvider);
      expect(registry.isRegistered('google-sheets')).toBe(true);

      registry.unregister('google-sheets');
      expect(registry.isRegistered('google-sheets')).toBe(false);
      expect(registry.getRegistered()).not.toContain('google-sheets');
    });

    it('should handle unregistering non-existent provider', () => {
      expect(() => registry.unregister('non-existent' as any)).not.toThrow();
    });
  });

  describe('isRegistered', () => {
    it('should return false for unregistered provider', () => {
      expect(registry.isRegistered('google-sheets')).toBe(false);
    });

    it('should return true for registered provider', () => {
      registry.register('google-sheets', GoogleSheetsDataProvider);
      expect(registry.isRegistered('google-sheets')).toBe(true);
    });
  });

  describe('getRegistered', () => {
    it('should return empty array initially', () => {
      expect(registry.getRegistered()).toEqual([]);
    });

    it('should return registered provider types', () => {
      registry.register('google-sheets', GoogleSheetsDataProvider);
      expect(registry.getRegistered()).toEqual(['google-sheets']);
    });
  });
});

describe('DataProviderFactoryImpl', () => {
  let registry: DataProviderRegistryImpl;
  let factory: DataProviderFactoryImpl;

  const mockGoogleSheetsConfig: GoogleSheetsConfig = {
    name: 'Test Sheets',
    type: 'google-sheets',
    enabled: true,
    connectionStatus: 'disconnected',
    spreadsheetId: 'test-spreadsheet-id',
    authType: 'service-account',
    credentials: {
      type: 'service_account',
      project_id: 'test-project',
      private_key_id: 'test-key-id',
      private_key: '-----BEGIN PRIVATE KEY-----\ntest-key\n-----END PRIVATE KEY-----\n',
      client_email: 'test@test-project.iam.gserviceaccount.com',
      client_id: 'test-client-id',
      auth_uri: 'https://accounts.google.com/o/oauth2/auth',
      token_uri: 'https://oauth2.googleapis.com/token',
      auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
      client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/test%40test-project.iam.gserviceaccount.com',
    },
  };

  beforeEach(() => {
    registry = new DataProviderRegistryImpl();
    factory = new DataProviderFactoryImpl(registry);
  });

  describe('create', () => {
    it('should create a provider instance', () => {
      factory.register('google-sheets', GoogleSheetsDataProvider);

      const provider = factory.create(mockGoogleSheetsConfig);

      expect(provider).toBeInstanceOf(GoogleSheetsDataProvider);
      expect(provider.name).toBe('Google Sheets');
      expect(provider.type).toBe('google-sheets');
      expect(provider.getConfig()).toEqual(mockGoogleSheetsConfig);
    });

    it('should throw error for unregistered provider type', () => {
      expect(() => factory.create(mockGoogleSheetsConfig)).toThrow(
        "Provider type 'google-sheets' is not registered"
      );
    });
  });

  describe('register', () => {
    it('should register provider in underlying registry', () => {
      factory.register('google-sheets', GoogleSheetsDataProvider);

      expect(registry.isRegistered('google-sheets')).toBe(true);
      expect(factory.getAvailableTypes()).toContain('google-sheets');
    });
  });

  describe('getAvailableTypes', () => {
    it('should return empty array initially', () => {
      expect(factory.getAvailableTypes()).toEqual([]);
    });

    it('should return registered types', () => {
      factory.register('google-sheets', GoogleSheetsDataProvider);
      expect(factory.getAvailableTypes()).toEqual(['google-sheets']);
    });
  });

  describe('validateConfig', () => {
    beforeEach(() => {
      factory.register('google-sheets', GoogleSheetsDataProvider);
    });

    it('should validate valid Google Sheets config', () => {
      const result = factory.validateConfig(mockGoogleSheetsConfig);

      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should return error for missing provider type', () => {
      const invalidConfig = { ...mockGoogleSheetsConfig, type: undefined as any };

      const result = factory.validateConfig(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Provider type is required');
    });

    it('should return error for unregistered provider type', () => {
      const invalidConfig = { ...mockGoogleSheetsConfig, type: 'non-existent' as any };

      const result = factory.validateConfig(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Provider type 'non-existent' is not registered");
      expect(result.suggestions).toContain('Available types: google-sheets');
    });

    it('should validate Google Sheets specific fields', () => {
      const invalidConfig = {
        ...mockGoogleSheetsConfig,
        spreadsheetId: '',
        authType: undefined as any,
      };

      const result = factory.validateConfig(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Spreadsheet ID is required');
      expect(result.errors).toContain('Authentication type is required');
    });

    it('should require credentials for service account auth', () => {
      const invalidConfig = {
        ...mockGoogleSheetsConfig,
        authType: 'service-account' as const,
        credentials: undefined,
      };

      const result = factory.validateConfig(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Service account credentials are required');
    });

    it('should validate ClickHouse config fields (future)', () => {
      const clickhouseConfig = {
        name: 'Test ClickHouse',
        type: 'clickhouse' as const,
        enabled: true,
        connectionStatus: 'disconnected' as const,
        host: '',
        port: 8123,
        database: '',
        username: 'default',
        password: '',
        table: '',
      };

      const result = factory.validateConfig(clickhouseConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Host is required');
      expect(result.errors).toContain('Database is required');
      expect(result.errors).toContain('Table is required');
    });
  });
});
