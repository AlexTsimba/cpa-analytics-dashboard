/**
 * Environment Variables Configuration Tests
 *
 * Tests to verify that environment variables are properly configured
 * and utility functions work correctly.
 */

import {
  getEnvVar,
  getOptionalEnvVar,
  getBooleanEnvVar,
  getNumericEnvVar,
  getFeatureFlags,
  getRateLimitConfig,
  isDevelopment,
  isProduction,
  isTest,
  shouldUseMockData,
  isDebugMode,
  validateEnvironmentVariables,
} from '@/lib/env';

// Mock environment variables for testing
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    NODE_ENV: 'test',
    NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  };
});

afterAll(() => {
  process.env = originalEnv;
});

describe('Environment Variable Utilities', () => {
  describe('getEnvVar', () => {
    it('should return environment variable value', () => {
      process.env.TEST_VAR = 'test_value';
      expect(getEnvVar('TEST_VAR')).toBe('test_value');
    });

    it('should return default value when variable is not set', () => {
      expect(getEnvVar('MISSING_VAR', 'default')).toBe('default');
    });

    it('should throw error when required variable is missing', () => {
      expect(() => getEnvVar('MISSING_VAR')).toThrow(
        'Missing required environment variable: MISSING_VAR'
      );
    });
  });

  describe('getOptionalEnvVar', () => {
    it('should return environment variable value', () => {
      process.env.OPTIONAL_VAR = 'optional_value';
      expect(getOptionalEnvVar('OPTIONAL_VAR')).toBe('optional_value');
    });

    it('should return default value when variable is not set', () => {
      expect(getOptionalEnvVar('MISSING_OPTIONAL', 'default')).toBe('default');
    });

    it('should return empty string as default', () => {
      expect(getOptionalEnvVar('MISSING_OPTIONAL')).toBe('');
    });
  });

  describe('getBooleanEnvVar', () => {
    it('should return true for "true"', () => {
      process.env.BOOL_VAR = 'true';
      expect(getBooleanEnvVar('BOOL_VAR')).toBe(true);
    });

    it('should return true for "1"', () => {
      process.env.BOOL_VAR = '1';
      expect(getBooleanEnvVar('BOOL_VAR')).toBe(true);
    });

    it('should return true for "yes"', () => {
      process.env.BOOL_VAR = 'yes';
      expect(getBooleanEnvVar('BOOL_VAR')).toBe(true);
    });

    it('should return false for "false"', () => {
      process.env.BOOL_VAR = 'false';
      expect(getBooleanEnvVar('BOOL_VAR')).toBe(false);
    });

    it('should return default value when variable is not set', () => {
      expect(getBooleanEnvVar('MISSING_BOOL', true)).toBe(true);
      expect(getBooleanEnvVar('MISSING_BOOL', false)).toBe(false);
    });
  });

  describe('getNumericEnvVar', () => {
    it('should return numeric value', () => {
      process.env.NUM_VAR = '123';
      expect(getNumericEnvVar('NUM_VAR')).toBe(123);
    });

    it('should return default value for invalid number', () => {
      process.env.NUM_VAR = 'not_a_number';
      expect(getNumericEnvVar('NUM_VAR', 456)).toBe(456);
    });

    it('should return default value when variable is not set', () => {
      expect(getNumericEnvVar('MISSING_NUM', 789)).toBe(789);
    });
  });

  describe('getFeatureFlags', () => {
    it('should return correct feature flags', () => {
      process.env.NEXT_PUBLIC_ENABLE_COHORT_ANALYSIS = 'true';
      process.env.NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES = 'false';
      process.env.NEXT_PUBLIC_DATA_REFRESH_INTERVAL = '5000';

      const flags = getFeatureFlags();

      expect(flags.enableCohortAnalysis).toBe(true);
      expect(flags.enableRealTimeUpdates).toBe(false);
      expect(flags.dataRefreshInterval).toBe(5000);
    });

    it('should return default values when variables are not set', () => {
      const flags = getFeatureFlags();

      expect(flags.enableCohortAnalysis).toBe(true);
      expect(flags.enableRealTimeUpdates).toBe(true);
      expect(flags.enableDataExport).toBe(true);
      expect(flags.enableDarkMode).toBe(true);
      expect(flags.dataRefreshInterval).toBe(300000);
    });
  });

  describe('getRateLimitConfig', () => {
    it('should return correct rate limit configuration', () => {
      process.env.API_RATE_LIMIT_REQUESTS = '200';
      process.env.API_RATE_LIMIT_WINDOW = '60000';

      const config = getRateLimitConfig();

      expect(config.requests).toBe(200);
      expect(config.windowMs).toBe(60000);
    });

    it('should return default values when variables are not set', () => {
      const config = getRateLimitConfig();

      expect(config.requests).toBe(100);
      expect(config.windowMs).toBe(900000);
    });
  });

  describe('Environment detection', () => {
    it('should correctly identify test environment', () => {
      process.env.NODE_ENV = 'test';
      expect(isTest()).toBe(true);
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(false);
    });

    it('should correctly identify development environment', () => {
      process.env.NODE_ENV = 'development';
      expect(isDevelopment()).toBe(true);
      expect(isTest()).toBe(false);
      expect(isProduction()).toBe(false);
    });

    it('should correctly identify production environment', () => {
      process.env.NODE_ENV = 'production';
      expect(isProduction()).toBe(true);
      expect(isDevelopment()).toBe(false);
      expect(isTest()).toBe(false);
    });
  });

  describe('shouldUseMockData', () => {
    it('should return true when mock data is enabled', () => {
      process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'true';
      expect(shouldUseMockData()).toBe(true);
    });

    it('should return false when mock data is disabled', () => {
      process.env.NEXT_PUBLIC_USE_MOCK_DATA = 'false';
      expect(shouldUseMockData()).toBe(false);
    });

    it('should return false by default', () => {
      expect(shouldUseMockData()).toBe(false);
    });
  });

  describe('isDebugMode', () => {
    it('should return true when debug is enabled', () => {
      process.env.DEBUG = 'true';
      expect(isDebugMode()).toBe(true);
    });

    it('should return false when debug is disabled', () => {
      process.env.DEBUG = 'false';
      expect(isDebugMode()).toBe(false);
    });

    it('should return false by default', () => {
      expect(isDebugMode()).toBe(false);
    });
  });

  describe('validateEnvironmentVariables', () => {
    it('should not throw when all required variables are set', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000';
      process.env.NODE_ENV = 'test';

      expect(() => validateEnvironmentVariables()).not.toThrow();
    });

    it('should throw when required variables are missing', () => {
      delete process.env.NEXT_PUBLIC_APP_URL;

      expect(() => validateEnvironmentVariables()).toThrow(
        'Missing required environment variables: NEXT_PUBLIC_APP_URL'
      );
    });
  });
});
