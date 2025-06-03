import { describe, it, expect } from 'vitest';

import {
  getAppConfig,
  getGoogleSheetsConfig,
  getAuthConfig,
  getAnalyticsConfig,
  getFeatureFlags,
  isDevelopment,
  isProduction,
  isTest,
} from '@/lib/env';

describe('Environment Configuration', () => {
  describe('getAppConfig', () => {
    it('returns application configuration object', () => {
      const config = getAppConfig();
      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
    });

    it('includes required app fields', () => {
      const config = getAppConfig();
      expect(config).toHaveProperty('environment');
      expect(config).toHaveProperty('features');
      expect(config).toHaveProperty('analytics');
    });
  });

  describe('getGoogleSheetsConfig', () => {
    it('returns null when credentials are not available', () => {
      const config = getGoogleSheetsConfig(false);
      expect(config).toBeNull();
    });
  });

  describe('getAuthConfig', () => {
    it('returns null when auth config is not available', () => {
      const config = getAuthConfig();
      expect(config).toBeNull();
    });
  });

  describe('getAnalyticsConfig', () => {
    it('returns analytics configuration object', () => {
      const config = getAnalyticsConfig();
      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
    });
  });

  describe('getFeatureFlags', () => {
    it('returns feature flags configuration', () => {
      const flags = getFeatureFlags();
      expect(flags).toBeDefined();
      expect(typeof flags).toBe('object');
      expect(flags).toHaveProperty('enableCohortAnalysis');
      expect(flags).toHaveProperty('enableRealTimeUpdates');
    });
  });

  describe('Environment Detection', () => {
    it('correctly identifies test environment', () => {
      expect(isTest()).toBe(true);
      expect(isDevelopment()).toBe(false);
      expect(isProduction()).toBe(false);
    });

    it('returns boolean values for environment checks', () => {
      expect(typeof isDevelopment()).toBe('boolean');
      expect(typeof isProduction()).toBe('boolean');
      expect(typeof isTest()).toBe('boolean');
    });
  });
});
