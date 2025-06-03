'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  MetricCell,
  TableCaption,
} from '@/components/ui/data-table';
import { FilterBar, QuickFilters } from '@/components/ui/filter-bar';
import { KpiCard, KpiMetric } from '@/components/ui/kpi-card';
import { PageHeader } from '@/components/ui/page-header';

// Sample data for demonstrations
const sampleKpiData = [
  {
    title: 'Total Revenue',
    value: 125847.5,
    previousValue: 118923.25,
    format: 'currency' as const,
  },
  {
    title: 'Active Users',
    value: 12847,
    previousValue: 11923,
    format: 'number' as const,
  },
  {
    title: 'Conversion Rate',
    value: 0.0345,
    previousValue: 0.0312,
    format: 'percentage' as const,
  },
  {
    title: 'Average Order Value',
    value: 67.89,
    previousValue: 72.15,
    format: 'currency' as const,
  },
];

const sampleTableData = [
  {
    campaign: 'Google Ads - Q4',
    clicks: 15420,
    conversions: 542,
    revenue: 12847.5,
    ctr: 0.0351,
    status: 'active',
  },
  {
    campaign: 'Facebook - Retargeting',
    clicks: 8930,
    conversions: 312,
    revenue: 8934.25,
    ctr: 0.0349,
    status: 'active',
  },
  {
    campaign: 'LinkedIn - B2B',
    clicks: 3420,
    conversions: 98,
    revenue: 4567.89,
    ctr: 0.0287,
    status: 'paused',
  },
  {
    campaign: 'Twitter - Brand',
    clicks: 2156,
    conversions: 45,
    revenue: 1890.45,
    ctr: 0.0209,
    status: 'completed',
  },
];

const sampleFilters = [
  { id: 'campaign', label: 'Campaign', value: '', type: 'text' as const },
  {
    id: 'status',
    label: 'Status',
    value: '',
    type: 'select' as const,
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Paused', value: 'paused' },
      { label: 'Completed', value: 'completed' },
    ],
  },
  { id: 'budget', label: 'Budget', value: '', type: 'number' as const },
  { id: 'date', label: 'Date', value: '', type: 'date' as const },
];

const quickFilters = [
  { label: 'High Performance', value: 'high-perf', count: 12 },
  { label: 'Low CTR', value: 'low-ctr', count: 5 },
  { label: 'New Campaigns', value: 'new', count: 8 },
  { label: 'Needs Review', value: 'review', count: 3 },
];

export default function ComponentShowcase() {
  // Demo handlers (replace with actual implementations)
  const handleDateChange = (_range: string) => {
    // Date range changed: range
  };

  const handleRefresh = () => {
    // Refreshing...
  };

  const handleExport = () => {
    // Exporting...
  };

  const handleSettings = () => {
    // Opening settings...
  };

  const handleFilterAdd = (_filter: unknown, _value: unknown) => {
    // Filter added: filter.label, value
  };

  const handleFilterRemove = (_filterId: string) => {
    // Filter removed: filterId
  };

  const handleFiltersClear = () => {
    // All filters cleared
  };

  const handleQuickFilter = (_value: string) => {
    // Quick filter selected: value
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'paused':
        return <Badge variant="warning">Paused</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTrendForConversions = (
    conversions: number
  ): 'positive' | 'negative' | 'neutral' => {
    if (conversions > 500) return 'positive';
    if (conversions > 200) return 'neutral';
    return 'negative';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <PageHeader
          title="Analytics Components Showcase"
          description="Demonstration of custom Shadcn UI components designed for analytics dashboards"
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Components', current: true },
          ]}
          showDatePicker
          showRefresh
          showExport
          showSettings
          selectedDateRange="30d"
          onDateRangeChange={handleDateChange}
          onRefresh={handleRefresh}
          onExport={handleExport}
          onSettings={handleSettings}
        />

        <div className="space-y-8 p-6">
          {/* KPI Cards Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">KPI Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sampleKpiData.map((kpi, index) => (
                <KpiCard
                  key={index}
                  title={kpi.title}
                  value={kpi.value}
                  previousValue={kpi.previousValue}
                  format={kpi.format}
                  variant="elevated"
                />
              ))}
            </div>
          </section>

          {/* KPI Metrics Compact Version */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Compact KPI Metrics</h2>
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>
                  Key metrics overview in compact format
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <KpiMetric label="Sessions" value={45672} format="number" />
                  <KpiMetric
                    label="Revenue"
                    value={89234.56}
                    format="currency"
                  />
                  <KpiMetric label="CTR" value={0.0456} format="percentage" />
                  <KpiMetric
                    label="ROAS"
                    value={4.23}
                    format="decimal"
                    precision={2}
                  />
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Filter Bar Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Filter System</h2>
            <div className="space-y-4">
              <FilterBar
                filters={sampleFilters}
                activeFilters={[
                  {
                    id: 'status',
                    label: 'Status',
                    value: 'active',
                    displayValue: 'Active',
                  },
                  {
                    id: 'budget',
                    label: 'Budget',
                    value: '1000',
                    displayValue: '$1,000+',
                  },
                ]}
                onFilterAdd={handleFilterAdd}
                onFilterRemove={handleFilterRemove}
                onFiltersClear={handleFiltersClear}
                searchPlaceholder="Search campaigns..."
                variant="elevated"
                showFilterCount
              />

              <div>
                <h3 className="text-sm font-medium mb-2">Quick Filters</h3>
                <QuickFilters
                  filters={quickFilters}
                  onFilterSelect={handleQuickFilter}
                />
              </div>
            </div>
          </section>

          {/* Data Table Section */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Analytics Data Table</h2>
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>
                  Performance metrics for all active campaigns
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table size="default" density="normal">
                  <TableHeader>
                    <TableRow>
                      <TableHead sortable sortDirection="asc">
                        Campaign
                      </TableHead>
                      <TableHead sortable>Clicks</TableHead>
                      <TableHead sortable>Conversions</TableHead>
                      <TableHead sortable>Revenue</TableHead>
                      <TableHead sortable>CTR</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleTableData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {row.campaign}
                        </TableCell>
                        <MetricCell value={row.clicks} format="number" />
                        <MetricCell
                          value={row.conversions}
                          format="number"
                          trend={getTrendForConversions(row.conversions)}
                        />
                        <MetricCell
                          value={row.revenue}
                          format="currency"
                          precision={2}
                        />
                        <MetricCell
                          value={row.ctr}
                          format="percentage"
                          precision={2}
                        />
                        <TableCell>{getStatusBadge(row.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>
                    Showing 4 of 23 campaigns. Last updated 5 minutes ago.
                  </TableCaption>
                </Table>
              </CardContent>
            </Card>
          </section>

          {/* Component Variations */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Component Variations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Loading States */}
              <Card>
                <CardHeader>
                  <CardTitle>Loading States</CardTitle>
                  <CardDescription>
                    Components with loading indicators
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <KpiCard
                    title="Loading Metric"
                    value={0}
                    loading={true}
                    variant="outlined"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <KpiMetric label="Loading..." value={0} />
                    <KpiMetric label="Sessions" value={12345} />
                  </div>
                </CardContent>
              </Card>

              {/* Error States */}
              <Card>
                <CardHeader>
                  <CardTitle>Error States</CardTitle>
                  <CardDescription>
                    Components with error handling
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <KpiCard
                    title="Failed Metric"
                    value="Error"
                    error={true}
                    variant="outlined"
                  />
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Retry
                    </Button>
                    <Button variant="ghost" size="sm">
                      Skip
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Compact Table */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Compact Data Table</CardTitle>
                  <CardDescription>
                    High-density table for dashboard widgets
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table size="compact" density="tight">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          Organic Search
                        </TableCell>
                        <MetricCell value={8745} format="number" />
                        <MetricCell value={12890.45} format="currency" />
                        <TableCell trend="positive">+12.5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Direct</TableCell>
                        <MetricCell value={6234} format="number" />
                        <MetricCell value={9876.32} format="currency" />
                        <TableCell trend="neutral">-2.1%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Social Media
                        </TableCell>
                        <MetricCell value={3456} format="number" />
                        <MetricCell value={5432.1} format="currency" />
                        <TableCell trend="negative">-8.3%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Theme Integration */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Theme Integration</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KpiCard
                title="Positive Trend"
                value={98765}
                previousValue={87654}
                format="number"
                trend="positive"
                variant="default"
              />
              <KpiCard
                title="Negative Trend"
                value={45321}
                previousValue={52468}
                format="number"
                trend="negative"
                variant="default"
              />
              <KpiCard
                title="Neutral Trend"
                value={15000}
                previousValue={15000}
                format="number"
                trend="neutral"
                variant="default"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
