/**
 * Global Type Definitions for CPA Analytics Dashboard
 *
 * This file contains shared TypeScript types used throughout the application.
 * Following strict TypeScript practices with comprehensive type safety.
 */

// ============================================================================
// CSV Data Types (Based on PRD Analysis)
// ============================================================================

/**
 * Player data structure from report.csv (1967 rows)
 */
export interface PlayerData {
  readonly playerId: number;
  readonly originalPlayerId: number;
  readonly signUpDate: string;
  readonly firstDepositDate: string | null;
  readonly promoId: number;
  readonly promoCode: string;
  readonly tagOs:
    | 'Android'
    | 'iOS'
    | 'Windows'
    | 'Other'
    | 'Mac OS X'
    | 'Chrome OS'
    | 'Linux';
  readonly tagSource: string;
  readonly tagSub2: number;
  readonly date: string;
  readonly prequalified: 0 | 1;
  readonly duplicate: 0 | 1;
  readonly selfExcluded: 0 | 1;
  readonly disabled: 0 | 1;
  readonly currency: 'EUR';
  readonly ftdCount: number;
  readonly ftdSum: number;
  readonly depositsCount: number;
  readonly depositsSum: number;
  readonly cashoutsCount: number;
  readonly cashoutsSum: number;
  readonly casinoBetsCount: number;
  readonly casinoRealNgr: number;
  readonly fixedPerPlayer: number;
}

/**
 * Traffic data structure from traffic_report.csv (404 rows)
 */
export interface TrafficData {
  readonly date: string;
  readonly foreignLandingId: number;
  readonly osFamily:
    | 'Android'
    | 'iOS'
    | 'Windows'
    | 'Other'
    | 'Mac OS X'
    | 'Chrome OS'
    | 'Linux';
  readonly allClicks: number;
  readonly uniqueClicks: number;
  readonly registrationsCount: number;
  readonly ftdCount: number;
  readonly depositsCount: number;
  readonly cr: number;
  readonly cftd: number;
  readonly cd: number;
  readonly rftd: number;
}

// ============================================================================
// Calculated Metrics Types
// ============================================================================

/**
 * Primary performance metrics
 */
export interface PrimaryMetrics {
  readonly ftdCount: number;
  readonly cpaCost: number;
  readonly ngr: number;
  readonly depositsSum: number;
  readonly cashoutsSum: number;
}

/**
 * Calculated performance ratios
 */
export interface PerformanceMetrics {
  readonly cost2Dep: number;
  readonly roas: number;
  readonly avgDepositsPerFtd: number;
  readonly avgDepositAmount: number;
  readonly avgFtdAmount: number;
}

/**
 * Quality and conversion metrics
 */
export interface QualityMetrics {
  readonly approvalRate: number;
  readonly duplicateRate: number;
  readonly cr: number;
  readonly cftd: number;
  readonly cd: number;
  readonly rftd: number;
}

// ============================================================================
// Filter System Types
// ============================================================================

/**
 * Date range filter options
 */
export interface DateRangeFilter {
  readonly startDate: string;
  readonly endDate: string;
  readonly mode: 'registration' | 'ftd';
  readonly preset?: 'today' | 'last7d' | 'last30d' | 'last90d' | 'custom';
}

/**
 * Available filter types with AND logic
 */
export interface DashboardFilters {
  readonly dateRange: DateRangeFilter;
  readonly sub2Ids: readonly number[];
  readonly sources: readonly string[];
  readonly osFamily: readonly PlayerData['tagOs'][];
  readonly currency: readonly PlayerData['currency'][];
  readonly playerStatus: {
    readonly includePrequalified: boolean;
    readonly includeDuplicates: boolean;
    readonly includeSelfExcluded: boolean;
    readonly includeDisabled: boolean;
  };
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Common props for dashboard components
 */
export interface DashboardComponentProps {
  readonly className?: string;
  readonly isLoading?: boolean;
  readonly error?: Error | null;
}

/**
 * KPI Card component props
 */
export interface KpiCardProps extends DashboardComponentProps {
  readonly title: string;
  readonly value: number | string;
  readonly format: 'number' | 'currency' | 'percentage';
  readonly trend?: {
    readonly value: number;
    readonly direction: 'up' | 'down' | 'neutral';
  };
}

// ============================================================================
// State Management Types
// ============================================================================

/**
 * Application state structure for Zustand
 */
export interface AppState {
  readonly filters: DashboardFilters;
  readonly metrics: {
    readonly primary: PrimaryMetrics | null;
    readonly performance: PerformanceMetrics | null;
    readonly quality: QualityMetrics | null;
  };
  readonly ui: {
    readonly currentTab: 'overview' | 'analytics' | 'conversions' | 'cohorts';
    readonly theme: 'light' | 'dark' | 'system';
    readonly sidebarCollapsed: boolean;
  };
}

/**
 * XState machine context
 */
export interface DataMachineContext {
  readonly playerData: readonly PlayerData[];
  readonly trafficData: readonly TrafficData[];
  readonly error: Error | null;
  readonly lastUpdated: Date | null;
}

/**
 * XState machine events
 */
export type DataMachineEvent =
  | { type: 'LOAD_DATA' }
  | {
      type: 'DATA_LOADED';
      data: { players: readonly PlayerData[]; traffic: readonly TrafficData[] };
    }
  | { type: 'DATA_ERROR'; error: Error }
  | { type: 'RETRY' }
  | { type: 'RESET' };

// ============================================================================
// API and Data Provider Types
// ============================================================================

/**
 * Abstract data provider interface
 */
export interface DataProvider {
  readonly loadPlayerData: () => Promise<readonly PlayerData[]>;
  readonly loadTrafficData: () => Promise<readonly TrafficData[]>;
  readonly validateData: (
    data: unknown
  ) => data is PlayerData[] | TrafficData[];
}

/**
 * CSV data provider implementation
 */
export interface CsvDataProvider extends DataProvider {
  readonly parsePlayerCsv: (csvContent: string) => readonly PlayerData[];
  readonly parseTrafficCsv: (csvContent: string) => readonly TrafficData[];
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Make all properties optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extract keys of a specific type
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

/**
 * Strict omit that requires the key to exist
 */
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;

/**
 * Non-nullable type
 */
export type NonNullable<T> = T extends null | undefined ? never : T;

// ============================================================================
// Error Types
// ============================================================================

/**
 * Application-specific error types
 */
export class DataValidationError extends Error {
  readonly code = 'DATA_VALIDATION_ERROR';
  constructor(
    message: string,
    public readonly field: string
  ) {
    super(message);
    this.name = 'DataValidationError';
  }
}

export class CsvParsingError extends Error {
  readonly code = 'CSV_PARSING_ERROR';
  constructor(
    message: string,
    public readonly row?: number
  ) {
    super(message);
    this.name = 'CsvParsingError';
  }
}

export class DataProviderError extends Error {
  readonly code = 'DATA_PROVIDER_ERROR';
  constructor(
    message: string,
    public readonly provider: string
  ) {
    super(message);
    this.name = 'DataProviderError';
  }
}

// ============================================================================
// Module Declarations
// ============================================================================

export {};
