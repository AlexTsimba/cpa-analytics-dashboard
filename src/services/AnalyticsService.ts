/**
 * Analytics Service
 * High-level service for dashboard analytics operations
 */

import { dataProviderFactory } from '@/providers';
import type {
  ConnectionTestResult,
  DataProvider,
  DataProviderConfig,
} from '@/types/providers';
import type {
  AnalyticsData,
  AnalyticsQuery,
  DashboardData,
  KPIMetrics,
} from '@/types/analytics';

export class AnalyticsService {
  private currentProvider: DataProvider | null = null;
  private config: DataProviderConfig | null = null;

  async setDataProvider(
    config: DataProviderConfig
  ): Promise<ConnectionTestResult> {
    try {
      // Validate config
      const validation = dataProviderFactory.validateConfig(config);
      if (!validation.valid) {
        return {
          success: false,
          message: `Invalid configuration: ${validation.errors?.join(', ')}`,
        };
      }

      // Create and connect provider
      const provider = dataProviderFactory.create(config);
      const connectionResult = await provider.connect(config);

      if (connectionResult.success) {
        this.currentProvider = provider;
        this.config = config;
      }

      return connectionResult;
    } catch (error) {
      return {
        success: false,
        message: `Failed to set provider: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }

  async getDashboardData(query: AnalyticsQuery): Promise<DashboardData> {
    if (!this.currentProvider) {
      throw new Error('No data provider configured');
    }

    const data = await this.currentProvider.fetch(query);

    return {
      kpis: this.calculateKPIs(data),
      chartData: this.transformToChartData(data),
      tableData: this.transformToTableData(data),
      filters: {
        campaigns: this.extractUniqueCampaigns(data),
        sources: this.extractUniqueSources(data),
        dateRange: query.dateRange,
      },
    };
  }

  async testConnection(): Promise<ConnectionTestResult> {
    if (!this.currentProvider) {
      return {
        success: false,
        message: 'No provider configured',
      };
    }

    return this.currentProvider.testConnection();
  }

  getAvailableProviders(): string[] {
    return dataProviderFactory.getAvailableTypes();
  }

  getCurrentConfig(): DataProviderConfig | null {
    return this.config;
  }

  private calculateKPIs(data: AnalyticsData): KPIMetrics {
    const { records } = data;

    const totals = records.reduce(
      (acc, record) => ({
        revenue: acc.revenue + record.revenue,
        cost: acc.cost + record.cost,
        conversions: acc.conversions + record.conversions,
        clicks: acc.clicks + record.clicks,
        impressions: acc.impressions + record.impressions,
      }),
      { revenue: 0, cost: 0, conversions: 0, clicks: 0, impressions: 0 }
    );

    const profit = totals.revenue - totals.cost;
    const roi = totals.cost > 0 ? (profit / totals.cost) * 100 : 0;
    const ctr =
      totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
    const cpa = totals.conversions > 0 ? totals.cost / totals.conversions : 0;
    const conversionRate =
      totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0;

    return {
      revenue: totals.revenue,
      cost: totals.cost,
      profit,
      roi,
      conversions: totals.conversions,
      clicks: totals.clicks,
      impressions: totals.impressions,
      ctr,
      cpa,
      conversionRate,
    };
  }

  private transformToChartData(data: AnalyticsData) {
    // Group by date
    const dateGroups = data.records.reduce(
      (acc, record) => {
        const date = record.timestamp.toISOString().split('T')[0] ?? 'unknown';
        acc[date] ??= { revenue: 0, cost: 0, clicks: 0, conversions: 0 };
        acc[date].revenue += record.revenue;
        acc[date].cost += record.cost;
        acc[date].clicks += record.clicks;
        acc[date].conversions += record.conversions;
        return acc;
      },
      {} as Record<
        string,
        { revenue: number; cost: number; clicks: number; conversions: number }
      >
    );

    return Object.entries(dateGroups).map(([date, metrics]) => ({
      date,
      ...metrics,
    }));
  }

  private transformToTableData(data: AnalyticsData) {
    return data.records.map((record) => ({
      id: record.id,
      campaign: record.campaign_id,
      source: record.source,
      date: record.timestamp.toISOString().split('T')[0] ?? '',
      clicks: record.clicks,
      cost: record.cost,
      conversions: record.conversions,
      revenue: record.revenue,
    }));
  }

  private extractUniqueCampaigns(data: AnalyticsData): string[] {
    return [...new Set(data.records.map((r) => r.campaign_id))];
  }

  private extractUniqueSources(data: AnalyticsData): string[] {
    return [...new Set(data.records.map((r) => r.source))];
  }
}

// Singleton instance
export const analyticsService = new AnalyticsService();
