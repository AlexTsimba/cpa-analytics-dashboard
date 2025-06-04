/**
 * Data Providers Index
 * Exports all provider-related functionality
 */

// Base classes and utilities
export { BaseDataProvider } from './base/BaseDataProvider';
export { 
  DataProviderRegistryImpl,
  DataProviderFactoryImpl,
  providerRegistry,
  dataProviderFactory,
} from './base/ProviderFactory';

// Provider implementations
export { GoogleSheetsDataProvider } from './google-sheets/GoogleSheetsProvider';

// Provider registration
import { GoogleSheetsDataProvider } from './google-sheets/GoogleSheetsProvider';
import { providerRegistry } from './base/ProviderFactory';

// Auto-register available providers
providerRegistry.register('google-sheets', GoogleSheetsDataProvider);

// Re-export types
export type * from '@/types/providers';
export type * from '@/types/analytics';
