/**
 * Affiliate Management Dashboard Component
 *
 * TraffBoard-inspired professional interface for affiliate managers
 * Optimized for long work sessions with minimal visual noise
 */

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
import { TrafficOverview } from '@/components/traffic-overview';
import { formatCurrency } from '@/lib/format';

// Simulated data based on the CSV structure provided
const affiliateData = {
  campaigns: {
    active: 47,
    paused: 12,
    pending: 8,
    total: 67,
  },
  revenue: {
    today: 8247.5,
    yesterday: 7892.3,
    mtd: 184250.75,
    change: '+4.5%',
  },
  partners: {
    total: 156,
    active: 134,
    topPerforming: 23,
  },
  conversions: {
    rate: 3.42,
    trend: '+0.18%',
    total: 1247,
  },
};

const recentCampaigns = [
  {
    id: 'CMP-001',
    name: 'Finance Offers Q2',
    partner: 'PartnerMax',
    status: 'active',
    revenue: 2847.5,
    cr: 4.2,
  },
  {
    id: 'CMP-002',
    name: 'Gaming Mobile Push',
    partner: 'AdVantage',
    status: 'active',
    revenue: 1923.75,
    cr: 3.8,
  },
  {
    id: 'CMP-003',
    name: 'Dating Tier1 FB',
    partner: 'LeadGen Pro',
    status: 'paused',
    revenue: 0,
    cr: 0,
  },
  {
    id: 'CMP-004',
    name: 'Crypto Edu Native',
    partner: 'TrafficFlow',
    status: 'active',
    revenue: 3421.25,
    cr: 5.1,
  },
  {
    id: 'CMP-005',
    name: 'Health Supplements',
    partner: 'ConvertMax',
    status: 'pending',
    revenue: 0,
    cr: 0,
  },
];

const topPartners = [
  { name: 'PartnerMax', campaigns: 12, revenue: 24750.5, conversionRate: 4.2 },
  { name: 'AdVantage', campaigns: 8, revenue: 18923.75, conversionRate: 3.9 },
  {
    name: 'LeadGen Pro',
    campaigns: 15,
    revenue: 32147.25,
    conversionRate: 3.7,
  },
  { name: 'TrafficFlow', campaigns: 6, revenue: 15421.8, conversionRate: 4.5 },
];

export const AffiliateDashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'secondary';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <main className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button size="sm" variant="outline" className="text-xs">
          Export Data
        </Button>
        <Button size="sm" className="text-xs">
          New Campaign
        </Button>
      </div>

      {/* Key Metrics - Compact Professional Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {affiliateData.campaigns.active}
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="success" className="px-1.5 py-0.5">
                Active
              </Badge>
              <span className="text-muted-foreground">
                {affiliateData.campaigns.total} total
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenue Today
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {formatCurrency(affiliateData.revenue.today)}
            </div>
            <div className="text-xs text-success">
              {affiliateData.revenue.change} vs yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Partners
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {affiliateData.partners.active}
            </div>
            <div className="text-xs text-muted-foreground">
              {affiliateData.partners.total} registered
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {affiliateData.conversions.rate}%
            </div>
            <div className="text-xs text-success">
              {affiliateData.conversions.trend} this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Overview Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-foreground">
            Traffic Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            Real-time traffic monitoring and source analysis
          </p>
        </div>
        <TrafficOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Campaigns */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Recent Campaigns
            </CardTitle>
            <CardDescription className="text-sm">
              Latest campaign activity and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-3 border border-border rounded-md bg-card/50"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {campaign.name}
                    </span>
                    <Badge
                      variant={getStatusColor(campaign.status)}
                      className="text-xs"
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {campaign.id} • {campaign.partner}
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-medium text-foreground">
                    {formatCurrency(campaign.revenue)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {campaign.cr > 0 ? `${campaign.cr}% CR` : 'No data'}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Partners */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Top Partners
            </CardTitle>
            <CardDescription className="text-sm">
              Best performing affiliate partners
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPartners.map((partner, index) => (
              <div
                key={partner.name}
                className="flex items-center justify-between p-3 border border-border rounded-md bg-card/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                    #{index + 1}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-foreground">
                      {partner.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {partner.campaigns} campaigns
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-medium text-foreground">
                    {formatCurrency(partner.revenue)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {partner.conversionRate}% CR
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Status - Keitaro Style */}
      <Card className="border-border bg-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">System Status</CardTitle>
          <CardDescription className="text-sm">
            Tracking and system health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">API Status</span>
              <Badge variant="success" className="text-xs">
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tracking</span>
              <Badge variant="success" className="text-xs">
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Data Sync</span>
              <Badge variant="success" className="text-xs">
                Real-time
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Last Update</span>
              <span className="text-xs text-muted-foreground">30 sec ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};
