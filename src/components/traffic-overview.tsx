/**
 * Traffic Overview Component
 *
 * Professional traffic monitoring component inspired by Keitaro's design
 * Shows real-time traffic data with minimal visual noise
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
import { formatCurrency, formatNumber } from '@/lib/format';

// Simulated real-time traffic data
const trafficData = {
  realTime: {
    clicks: 1247,
    uniqueVisitors: 892,
    conversions: 43,
    revenue: 2847.5,
  },
  sources: [
    {
      name: 'Facebook Ads',
      clicks: 456,
      conversions: 18,
      spend: 892.5,
      roi: 285,
    },
    {
      name: 'Google Ads',
      clicks: 324,
      conversions: 12,
      spend: 654.25,
      roi: 195,
    },
    { name: 'TikTok Ads', clicks: 289, conversions: 8, spend: 445.8, roi: 142 },
    { name: 'Native', clicks: 178, conversions: 5, spend: 298.75, roi: 167 },
  ],
  countries: [
    {
      code: 'US',
      name: 'United States',
      clicks: 387,
      conversions: 16,
      flag: '🇺🇸',
    },
    { code: 'CA', name: 'Canada', clicks: 234, conversions: 9, flag: '🇨🇦' },
    {
      code: 'UK',
      name: 'United Kingdom',
      clicks: 198,
      conversions: 7,
      flag: '🇬🇧',
    },
    { code: 'AU', name: 'Australia', clicks: 156, conversions: 6, flag: '🇦🇺' },
    { code: 'DE', name: 'Germany', clicks: 142, conversions: 3, flag: '🇩🇪' },
  ],
};

export const TrafficOverview = () => {
  const getROIColor = (roi: number) => {
    if (roi >= 200) return 'success';
    if (roi >= 150) return 'warning';
    return 'secondary';
  };

  return (
    <div className="space-y-6">
      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="text-center space-y-1">
              <div className="text-2xl font-semibold text-foreground">
                {formatNumber(trafficData.realTime.clicks)}
              </div>
              <div className="text-xs text-muted-foreground">Clicks (24h)</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="text-center space-y-1">
              <div className="text-2xl font-semibold text-foreground">
                {formatNumber(trafficData.realTime.uniqueVisitors)}
              </div>
              <div className="text-xs text-muted-foreground">
                Unique Visitors
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="text-center space-y-1">
              <div className="text-2xl font-semibold text-foreground">
                {trafficData.realTime.conversions}
              </div>
              <div className="text-xs text-muted-foreground">Conversions</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-4">
            <div className="text-center space-y-1">
              <div className="text-2xl font-semibold text-foreground">
                {formatCurrency(trafficData.realTime.revenue)}
              </div>
              <div className="text-xs text-muted-foreground">Revenue</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">
                  Traffic Sources
                </CardTitle>
                <CardDescription className="text-sm">
                  Performance by source
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {trafficData.sources.map((source) => (
              <div
                key={source.name}
                className="flex items-center justify-between p-3 border border-border rounded-md bg-card/30"
              >
                <div className="space-y-1">
                  <div className="text-sm font-medium text-foreground">
                    {source.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {source.clicks} clicks • {source.conversions} conv
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant={getROIColor(source.roi)} className="text-xs">
                    {source.roi}% ROI
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    ${source.spend}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">
                  Top Countries
                </CardTitle>
                <CardDescription className="text-sm">
                  Traffic by geography
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" className="text-xs">
                GEO Report
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {trafficData.countries.map((country, _index) => (
              <div
                key={country.code}
                className="flex items-center justify-between p-3 border border-border rounded-md bg-card/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs">
                    {country.flag}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-foreground">
                      {country.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {country.clicks} clicks
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-medium text-foreground">
                    {country.conversions} conv
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {((country.conversions / country.clicks) * 100).toFixed(1)}%
                    CR
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions - Keitaro Style */}
      <Card className="border-border bg-muted/15">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">
                Quick Actions
              </div>
              <div className="text-xs text-muted-foreground">
                Manage campaigns and traffic flows
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                Block IP
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Add Domain
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Traffic Test
              </Button>
              <Button size="sm" className="text-xs">
                New Flow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
