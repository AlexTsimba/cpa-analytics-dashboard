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
// TODO: Add Supabase provider when implemented

// Provider registration
// TODO: Import and register providers when implemented

// Auto-register available providers
// TODO: Register Supabase provider when implemented

// Re-export types
export type * from '@/types/providers';
export type * from '@/types/analytics';
