/**
 * Environment Variables Utilities
 *
 * This module provides utilities for safely accessing and validating
 * environment variables with proper type checking and default values.
 */

import type {
  AnalyticsConfig,
  AuthConfig,
  FeatureFlags,
  RateLimitConfig,
} from '@/types/env';

// -----------------------------------------------------------------------------
// ENVIRONMENT VARIABLE GETTERS
// -----------------------------------------------------------------------------

/**
 * Get a required environment variable
 * @param key - Environment variable key
 * @param defaultValue - Optional default value
 * @throws Error if the variable is not set and no default is provided
 */
export function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];

  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value ?? defaultValue ?? '';
}

/**
 * Get an optional environment variable
 * @param key - Environment variable key
 * @param defaultValue - Default value if not set
 */
export function getOptionalEnvVar(key: string, defaultValue = ''): string {
  return process.env[key] ?? defaultValue;
}

/**
 * Get a boolean environment variable
 * @param key - Environment variable key
 * @param defaultValue - Default boolean value
 */
export function getBooleanEnvVar(key: string, defaultValue = false): boolean {
  const value = process.env[key]?.toLowerCase();

  if (value === undefined) {
    return defaultValue;
  }

  return value === 'true' || value === '1' || value === 'yes';
}

/**
 * Get a numeric environment variable
 * @param key - Environment variable key
 * @param defaultValue - Default numeric value
 */
export function getNumericEnvVar(key: string, defaultValue = 0): number {
  const value = process.env[key];

  if (!value) {
    return defaultValue;
  }

  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

// -----------------------------------------------------------------------------
// CONFIGURATION BUILDERS
// -----------------------------------------------------------------------------

/**
 * Get authentication configuration from environment variables
 */
export function getAuthConfig(): AuthConfig | null {
  try {
    const config: AuthConfig = {
      nextAuthUrl: getEnvVar('NEXTAUTH_URL'),
      nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),
      googleClientId: getOptionalEnvVar('GOOGLE_CLIENT_ID'),
      googleClientSecret: getOptionalEnvVar('GOOGLE_CLIENT_SECRET'),
    };

    return config;
  } catch (_error) {
    return null;
  }
}

/**
 * Get analytics configuration from environment variables
 */
export function getAnalyticsConfig(): AnalyticsConfig {
  return {
    gaTrackingId: getOptionalEnvVar('NEXT_PUBLIC_GA_MEASUREMENT_ID'),
    sentryDsn: getOptionalEnvVar('SENTRY_DSN'),
    sentryAuthToken: getOptionalEnvVar('SENTRY_AUTH_TOKEN'),
  };
}

/**
 * Get feature flags configuration from environment variables
 */
export function getFeatureFlags(): FeatureFlags {
  return {
    enableCohortAnalysis: getBooleanEnvVar(
      'NEXT_PUBLIC_ENABLE_COHORT_ANALYSIS',
      true
    ),
    enableRealTimeUpdates: getBooleanEnvVar(
      'NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES',
      true
    ),
    enableDataExport: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_DATA_EXPORT', true),
    enableDarkMode: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_DARK_MODE', true),
    dataRefreshInterval: getNumericEnvVar(
      'NEXT_PUBLIC_DATA_REFRESH_INTERVAL',
      300000
    ),
  };
}

/**
 * Get rate limiting configuration from environment variables
 */
export function getRateLimitConfig(): RateLimitConfig {
  return {
    requests: getNumericEnvVar('API_RATE_LIMIT_REQUESTS', 100),
    windowMs: getNumericEnvVar('API_RATE_LIMIT_WINDOW', 900000),
  };
}

// -----------------------------------------------------------------------------
// ENVIRONMENT VALIDATION
// -----------------------------------------------------------------------------

/**
 * Validate that all required environment variables are set
 * @throws Error if validation fails
 */
export function validateEnvironmentVariables(): void {
  const requiredVars = ['NEXT_PUBLIC_APP_URL', 'NODE_ENV'];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

/**
 * Check if the application is running in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if the application is running in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Check if the application is running in test mode
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Check if mock data should be used
 */
export function shouldUseMockData(): boolean {
  return getBooleanEnvVar('NEXT_PUBLIC_USE_MOCK_DATA', false);
}

/**
 * Check if debug mode is enabled
 */
export function isDebugMode(): boolean {
  return getBooleanEnvVar('DEBUG', false);
}

// -----------------------------------------------------------------------------
// APP CONFIGURATION
// -----------------------------------------------------------------------------

/**
 * Get the complete application configuration
 */
export function getAppConfig() {
  return {
    appUrl: getEnvVar('NEXT_PUBLIC_APP_URL'),
    environment: process.env.NODE_ENV,
    auth: getAuthConfig(),
    analytics: getAnalyticsConfig(),
    features: getFeatureFlags(),
    rateLimit: getRateLimitConfig(),
    debug: isDebugMode(),
    useMockData: shouldUseMockData(),
  };
}
