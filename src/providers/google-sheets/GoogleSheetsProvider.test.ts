/**
 * Google Sheets Data Provider Tests
 * Comprehensive test suite for the Google Sheets provider
 */

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { GoogleSheetsDataProvider } from './GoogleSheetsProvider';
import type { GoogleSheetsConfig } from '@/types/providers';
import type { AnalyticsQuery } from '@/types/analytics';

// Mock googleapis
vi.mock('googleapis', () => ({
  google: {
    auth: {
      GoogleAuth: vi.fn(),
    },
    sheets: vi.fn(),
  },
}));

describe('GoogleSheetsDataProvider', () => {
  let provider: GoogleSheetsDataProvider;
  let mockGoogleAuth: Mock;
  let mockSheetsClient: Mock;

  const mockConfig: GoogleSheetsConfig = {
    name: 'Test Sheets',
    type: 'google-sheets',
    enabled: true,
    connectionStatus: 'disconnected',
    spreadsheetId: 'test-spreadsheet-id',
    sheetName: 'Sheet1',
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
    provider = new GoogleSheetsDataProvider();
    
    // Setup mocks
    mockGoogleAuth = {
      getClient: vi.fn().mockResolvedValue({}),
    };
    
    mockSheetsClient = {
      spreadsheets: {
        get: vi.fn(),
        values: {
          get: vi.fn(),
        },
      },
    };

    const { google } = require('googleapis');
    google.auth.GoogleAuth = vi.fn().mockImplementation(() => mockGoogleAuth);
    google.sheets = vi.fn().mockReturnValue(mockSheetsClient);
  });

  describe('constructor', () => {
    it('should initialize with correct name and type', () => {
      expect(provider.name).toBe('Google Sheets');
      expect(provider.type).toBe('google-sheets');
    });

    it('should start in disconnected state', () => {
      expect(provider.getConnectionStatus()).toBe('disconnected');
      expect(provider.isReady()).toBe(false);
    });
  });

  describe('connect', () => {
    it('should successfully connect with valid service account config', async () => {
      // Mock successful spreadsheet response
      mockSheetsClient.spreadsheets.get.mockResolvedValue({
        data: {
          properties: {
            title: 'Test Spreadsheet',
          },
          sheets: [
            {
              properties: {
                title: 'Sheet1',
              },
            },
          ],
        },
      });

      // Mock sample data response
      mockSheetsClient.spreadsheets.values.get.mockResolvedValue({
        data: {
          values: [
            ['Date', 'Campaign', 'Clicks', 'Cost', 'Conversions', 'Revenue'],
            ['2024-01-01', 'Campaign A', 100, 50, 5, 250],
            ['2024-01-02', 'Campaign B', 150, 75, 8, 400],
          ],
        },
      });

      const result = await provider.connect(mockConfig);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Test Spreadsheet');
      expect(result.latency).toBeGreaterThan(0);
      expect(result.sampleData).toBeDefined();
      expect(result.sampleData?.length).toBe(2);
    });

    it('should throw error for invalid config type', async () => {
      const invalidConfig = { ...mockConfig, type: 'clickhouse' as any };

      await expect(provider.connect(invalidConfig)).rejects.toThrow(
        'Invalid config type for Google Sheets provider'
      );
    });

    it('should throw error for OAuth2 authentication (not implemented)', async () => {
      const oauthConfig = { ...mockConfig, authType: 'oauth2' as any };

      await expect(provider.connect(oauthConfig)).rejects.toThrow(
        'OAuth2 authentication not yet implemented'
      );
    });

    it('should handle connection errors gracefully', async () => {
      mockSheetsClient.spreadsheets.get.mockRejectedValue(new Error('Network error'));

      await expect(provider.connect(mockConfig)).rejects.toThrow(
        'Failed to connect to Google Sheets: Network error'
      );
    });
  });

  describe('transform', () => {
    it('should transform valid sheet data to analytics records', async () => {
      const rawData = [
        ['Date', 'Campaign', 'Source', 'Clicks', 'Cost', 'Conversions', 'Revenue'],
        ['2024-01-01', 'Campaign A', 'google', 100, 50, 5, 250],
        ['2024-01-02', 'Campaign B', 'facebook', 150, 75, 8, 400],
      ];

      const result = await provider.transform(rawData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.records).toHaveLength(2);
      expect(result.data?.records[0]).toMatchObject({
        campaign_id: 'Campaign A',
        source: 'google',
        clicks: 100,
        cost: 50,
        conversions: 5,
        revenue: 250,
      });
    });

    it('should handle empty data gracefully', async () => {
      const result = await provider.transform([]);

      expect(result.success).toBe(true);
      expect(result.data?.records).toHaveLength(0);
    });

    it('should return error for invalid data format', async () => {
      const result = await provider.transform('invalid data');

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Raw data must be an array');
    });

    it('should handle missing columns gracefully', async () => {
      const rawData = [
        ['Date', 'Campaign'],
        ['2024-01-01', 'Campaign A'],
      ];

      const result = await provider.transform(rawData);

      expect(result.success).toBe(true);
      expect(result.data?.records).toHaveLength(1);
      expect(result.data?.records[0]).toMatchObject({
        campaign_id: 'Campaign A',
        clicks: 0,
        cost: 0,
        conversions: 0,
        revenue: 0,
      });
    });
  });

  describe('fetch', () => {
    beforeEach(async () => {
      // Setup connected provider
      mockSheetsClient.spreadsheets.get.mockResolvedValue({
        data: {
          properties: { title: 'Test Spreadsheet' },
        },
      });

      mockSheetsClient.spreadsheets.values.get.mockResolvedValue({
        data: {
          values: [
            ['Date', 'Campaign', 'Clicks', 'Cost'],
            ['2024-01-01', 'Campaign A', 100, 50],
          ],
        },
      });

      await provider.connect(mockConfig);
    });

    it('should fetch and transform data with query', async () => {
      const query: AnalyticsQuery = {
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        },
        metrics: ['clicks', 'cost'],
      };

      mockSheetsClient.spreadsheets.values.get.mockResolvedValue({
        data: {
          values: [
            ['Date', 'Campaign', 'Clicks', 'Cost'],
            ['2024-01-01', 'Campaign A', 100, 50],
            ['2024-01-02', 'Campaign B', 150, 75],
          ],
        },
      });

      const result = await provider.fetch(query);

      expect(result.records).toHaveLength(2);
      expect(result.totalCount).toBe(2);
      expect(result.metadata?.source).toBe('google-sheets');
    });

    it('should throw error when not connected', async () => {
      const disconnectedProvider = new GoogleSheetsDataProvider();
      const query: AnalyticsQuery = {
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-31'),
        },
        metrics: ['clicks'],
      };

      await expect(disconnectedProvider.fetch(query)).rejects.toThrow(
        'Provider not connected'
      );
    });

    it('should apply date range filters', async () => {
      const query: AnalyticsQuery = {
        dateRange: {
          start: new Date('2024-01-01'),
          end: new Date('2024-01-01'),
        },
        metrics: ['clicks'],
      };

      mockSheetsClient.spreadsheets.values.get.mockResolvedValue({
        data: {
          values: [
            ['Date', 'Campaign', 'Clicks'],
            ['2024-01-01', 'Campaign A', 100],
            ['2024-01-02', 'Campaign B', 150],
          ],
        },
      });

      const result = await provider.fetch(query);

      expect(result.records).toHaveLength(1);
      expect(result.records[0].campaign_id).toBe('Campaign A');
    });
  });

  describe('getSampleData', () => {
    it('should return empty array when not connected', async () => {
      const result = await provider.getSampleData();
      expect(result).toEqual([]);
    });

    it('should return sample records when connected', async () => {
      // Connect first
      await provider.connect(mockConfig);

      mockSheetsClient.spreadsheets.values.get.mockResolvedValue({
        data: {
          values: [
            ['Date', 'Campaign', 'Clicks'],
            ['2024-01-01', 'Campaign A', 100],
          ],
        },
      });

      const result = await provider.getSampleData(5);

      expect(result).toHaveLength(1);
      expect(result[0].campaign_id).toBe('Campaign A');
    });
  });

  describe('getAvailableColumns', () => {
    it('should return column headers', async () => {
      await provider.connect(mockConfig);

      mockSheetsClient.spreadsheets.values.get.mockResolvedValue({
        data: {
          values: [
            ['Date', 'Campaign', 'Clicks', 'Cost', 'Revenue'],
          ],
        },
      });

      const result = await provider.getAvailableColumns();

      expect(result).toEqual(['Date', 'Campaign', 'Clicks', 'Cost', 'Revenue']);
    });

    it('should return empty array when not connected', async () => {
      const result = await provider.getAvailableColumns();
      expect(result).toEqual([]);
    });
  });

  describe('getRecordCount', () => {
    it('should return record count from sheet properties', async () => {
      await provider.connect(mockConfig);

      mockSheetsClient.spreadsheets.get.mockResolvedValue({
        data: {
          sheets: [
            {
              properties: {
                title: 'Sheet1',
                gridProperties: {
                  rowCount: 101, // 100 data rows + 1 header
                },
              },
            },
          ],
        },
      });

      const result = await provider.getRecordCount();

      expect(result).toBe(100);
    });

    it('should return 0 when not connected', async () => {
      const result = await provider.getRecordCount();
      expect(result).toBe(0);
    });
  });

  describe('configure', () => {
    it('should accept valid Google Sheets config', () => {
      expect(() => provider.configure(mockConfig)).not.toThrow();
      expect(provider.getConfig()).toEqual(mockConfig);
    });

    it('should throw error for invalid config type', () => {
      const invalidConfig = { ...mockConfig, type: 'clickhouse' as any };

      expect(() => provider.configure(invalidConfig)).toThrow(
        'Invalid config type. Expected google-sheets, got clickhouse'
      );
    });
  });

  describe('testConnection', () => {
    it('should return failure when not configured', async () => {
      const result = await provider.testConnection();

      expect(result.success).toBe(false);
      expect(result.message).toBe('Provider not configured');
    });

    it('should test connection successfully when configured', async () => {
      provider.configure(mockConfig);

      mockSheetsClient.spreadsheets.get.mockResolvedValue({
        data: {
          properties: { title: 'Test Spreadsheet' },
        },
      });

      mockSheetsClient.spreadsheets.values.get.mockResolvedValue({
        data: {
          values: [
            ['Date', 'Campaign'],
            ['2024-01-01', 'Campaign A'],
          ],
        },
      });

      const result = await provider.testConnection();

      expect(result.success).toBe(true);
      expect(result.message).toContain('Test Spreadsheet');
    });
  });
});
