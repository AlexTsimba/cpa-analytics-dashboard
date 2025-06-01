/**
 * Global utility types and helpers for improved TypeScript development
 */

// Environment variable validation
export interface AppEnvironment {
  readonly NODE_ENV: 'development' | 'production' | 'test';
  readonly NEXT_PUBLIC_APP_URL: string;
  readonly NEXT_PUBLIC_API_URL?: string;
}

// Type guards
export const isPlayerData = (
  data: unknown
): data is import('./index').PlayerData => {
  return typeof data === 'object' && data !== null && 'playerId' in data;
};

export const isTrafficData = (
  data: unknown
): data is import('./index').TrafficData => {
  return (
    typeof data === 'object' && data !== null && 'foreignLandingId' in data
  );
};

// Validation helpers
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type AsyncValidationResult<T> = Promise<ValidationResult<T>>;
