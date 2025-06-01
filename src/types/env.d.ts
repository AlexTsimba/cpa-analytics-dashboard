/**
 * Environment Variables Type Definitions
 *
 * This file defines TypeScript interfaces for all environment variables
 * used in the CPA Analytics Dashboard application.
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // -----------------------------------------------------------------------------
      // APPLICATION SETTINGS
      // -----------------------------------------------------------------------------
      /** The URL where the application is deployed */
      NEXT_PUBLIC_APP_URL: string;

      /** Application environment */
      NODE_ENV: 'development' | 'test' | 'production';

      /** Vercel deployment URL */
      NEXT_PUBLIC_VERCEL_URL?: string;

      // -----------------------------------------------------------------------------
      // GOOGLE SHEETS API
      // -----------------------------------------------------------------------------
      /** Google Sheets API key for accessing CPA data */
      GOOGLE_SHEETS_API_KEY?: string;

      /** Google Sheets spreadsheet ID containing CPA data */
      GOOGLE_SHEETS_SPREADSHEET_ID?: string;

      /** Google service account email */
      GOOGLE_SHEETS_CLIENT_EMAIL?: string;

      /** Google service account private key */
      GOOGLE_SHEETS_PRIVATE_KEY?: string;

      // -----------------------------------------------------------------------------
      // DATABASE
      // -----------------------------------------------------------------------------
      /** Database connection URL */
      DATABASE_URL?: string;

      // -----------------------------------------------------------------------------
      // AUTHENTICATION
      // -----------------------------------------------------------------------------
      /** NextAuth.js base URL */
      NEXTAUTH_URL?: string;

      /** NextAuth.js secret for JWT signing */
      NEXTAUTH_SECRET?: string;

      /** Google OAuth client ID */
      GOOGLE_CLIENT_ID?: string;

      /** Google OAuth client secret */
      GOOGLE_CLIENT_SECRET?: string;

      // -----------------------------------------------------------------------------
      // ANALYTICS & MONITORING
      // -----------------------------------------------------------------------------
      /** Google Analytics measurement ID */
      NEXT_PUBLIC_GA_MEASUREMENT_ID?: string;

      /** Sentry DSN for error tracking */
      SENTRY_DSN?: string;

      /** Sentry authentication token */
      SENTRY_AUTH_TOKEN?: string;

      // -----------------------------------------------------------------------------
      // CACHING & PERFORMANCE
      // -----------------------------------------------------------------------------
      /** Redis connection URL for caching */
      REDIS_URL?: string;

      // -----------------------------------------------------------------------------
      // API RATE LIMITING
      // -----------------------------------------------------------------------------
      /** Maximum number of API requests per window */
      API_RATE_LIMIT_REQUESTS?: string;

      /** Rate limiting time window in milliseconds */
      API_RATE_LIMIT_WINDOW?: string;

      // -----------------------------------------------------------------------------
      // FEATURE FLAGS
      // -----------------------------------------------------------------------------
      /** Enable/disable cohort analysis feature */
      NEXT_PUBLIC_ENABLE_COHORT_ANALYSIS?: string;

      /** Enable/disable real-time data updates */
      NEXT_PUBLIC_ENABLE_REAL_TIME_UPDATES?: string;

      /** Enable/disable data export functionality */
      NEXT_PUBLIC_ENABLE_DATA_EXPORT?: string;

      /** Enable/disable dark mode support */
      NEXT_PUBLIC_ENABLE_DARK_MODE?: string;

      /** Data refresh interval in milliseconds */
      NEXT_PUBLIC_DATA_REFRESH_INTERVAL?: string;

      // -----------------------------------------------------------------------------
      // TASKMASTER API KEYS
      // -----------------------------------------------------------------------------
      /** Anthropic Claude API key */
      ANTHROPIC_API_KEY?: string;

      /** Perplexity AI API key */
      PERPLEXITY_API_KEY?: string;

      /** OpenAI API key */
      OPENAI_API_KEY?: string;

      /** Google AI API key */
      GOOGLE_API_KEY?: string;

      /** Mistral AI API key */
      MISTRAL_API_KEY?: string;

      /** xAI API key */
      XAI_API_KEY?: string;

      /** Azure OpenAI API key */
      AZURE_OPENAI_API_KEY?: string;

      /** Ollama API key for remote servers */
      OLLAMA_API_KEY?: string;

      // -----------------------------------------------------------------------------
      // DEVELOPMENT SETTINGS
      // -----------------------------------------------------------------------------
      /** Enable debug logging */
      DEBUG?: string;

      /** Use mock data instead of real data sources */
      NEXT_PUBLIC_USE_MOCK_DATA?: string;

      /** Enable performance monitoring */
      NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING?: string;
    }
  }
}

// -----------------------------------------------------------------------------
// ENVIRONMENT CONFIGURATION INTERFACES
// -----------------------------------------------------------------------------

/** Configuration for Google Sheets integration */
export interface GoogleSheetsConfig {
  apiKey: string;
  spreadsheetId: string;
  clientEmail: string;
  privateKey: string;
}

/** Configuration for authentication providers */
export interface AuthConfig {
  nextAuthUrl: string;
  nextAuthSecret: string;
  googleClientId?: string;
  googleClientSecret?: string;
}

/** Configuration for analytics and monitoring */
export interface AnalyticsConfig {
  gaTrackingId?: string;
  sentryDsn?: string;
  sentryAuthToken?: string;
}

/** Configuration for feature flags */
export interface FeatureFlags {
  enableCohortAnalysis: boolean;
  enableRealTimeUpdates: boolean;
  enableDataExport: boolean;
  enableDarkMode: boolean;
  dataRefreshInterval: number;
}

/** Configuration for API rate limiting */
export interface RateLimitConfig {
  requests: number;
  windowMs: number;
}

// This export is required to make this file a module
export {};
