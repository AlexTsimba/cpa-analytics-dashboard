/**
 * Analytics Data Types
 * Core interfaces for the CPA Analytics Dashboard data layer
 */

// Base analytics record structure
export interface AnalyticsRecord {
  id: string;
  timestamp: Date;
  campaign_id: string;
  source: string;
  medium?: string;
  clicks: number;
  impressions: number;
  cost: number;
  conversions: number;
  revenue: number;
  // Flexible additional fields for custom metrics
  [key: string]: unknown;
}

// Normalized data collection
export interface AnalyticsData {
  records: AnalyticsRecord[];
  totalCount: number;
  lastUpdated: Date;
  metadata?: {
    source: string;
    version: string;
    columns: string[];
    [key: string]: unknown;
  };
}

// Query interface for analytics requests
export interface AnalyticsQuery {
  dateRange: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, unknown>;
  groupBy?: string[];
  metrics: string[];
  orderBy?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  limit?: number;
  offset?: number;
}

// KPI calculation results
export interface KPIMetrics {
  revenue: number;
  cost: number;
  profit: number;
  roi: number;
  conversions: number;
  clicks: number;
  impressions: number;
  ctr: number;
  cpa: number;
  conversionRate: number;
}

// Chart data format
export interface ChartDataPoint {
  date: string;
  [metric: string]: string | number;
}

// Table data format
export interface TableRow {
  id: string;
  [column: string]: string | number | Date;
}

// Dashboard data aggregation
export interface DashboardData {
  kpis: KPIMetrics;
  chartData: ChartDataPoint[];
  tableData: TableRow[];
  filters: {
    campaigns: string[];
    sources: string[];
    dateRange: {
      start: Date;
      end: Date;
    };
  };
}
