/**
 * Data Providers Index
 * Exports all provider-related functionality for Digital Ocean PostgreSQL
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
// TODO: Add DigitalOceanPostgreSQLProvider when implemented

// Provider registration
// TODO: Import and register PostgreSQL provider when implemented

// Auto-register available providers
// TODO: Register PostgreSQL provider when implemented

// Re-export types
export type * from '@/types/providers';
export type * from '@/types/analytics';
