/**
 * Conversions Overview Page
 *
 * Professional conversion tracking and analysis for affiliate campaigns
 */

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Simulated conversion data
const conversionData = {
  overview: {
    totalConversions: 1247,
    conversionRate: 3.42,
    avgOrderValue: 89.5,
    revenue: 111607.5,
    change: '+8.2%',
  },
  topCampaigns: [
    {
      id: 'CMP-001',
      name: 'Finance Offers Q2',
      conversions: 387,
      rate: 4.2,
      revenue: 34629.5,
    },
    {
      id: 'CMP-004',
      name: 'Crypto Edu Native',
      conversions: 324,
      rate: 5.1,
      revenue: 29016.0,
    },
    {
      id: 'CMP-002',
      name: 'Gaming Mobile Push',
      conversions: 289,
      rate: 3.8,
      revenue: 25921.5,
    },
    {
      id: 'CMP-007',
      name: 'Health Supplements',
      conversions: 247,
      rate: 3.9,
      revenue: 22040.5,
    },
  ],
  conversionFunnel: [
    {
      stage: 'Landing Page Views',
      count: 36450,
      rate: 100,
      color: 'bg-chart-1',
    },
    { stage: 'Engaged Users', count: 18225, rate: 50, color: 'bg-chart-2' },
    { stage: 'Add to Cart', count: 5467, rate: 15, color: 'bg-chart-3' },
    { stage: 'Checkout Started', count: 2734, rate: 7.5, color: 'bg-chart-4' },
    {
      stage: 'Completed Purchase',
      count: 1247,
      rate: 3.42,
      color: 'bg-chart-5',
    },
  ],
};

const ConversionsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Conversions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track and analyze conversion performance across all campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="text-xs">
            Export Report
          </Button>
          <Button size="sm" className="text-xs">
            Create Flow
          </Button>
        </div>
      </div>

      {/* Conversion Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Conversions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {conversionData.overview.totalConversions.toLocaleString()}
            </div>
            <div className="text-xs text-success">
              {conversionData.overview.change} vs last period
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
              {conversionData.overview.conversionRate}%
            </div>
            <div className="text-xs text-success">+0.18% this week</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Order Value
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              ${conversionData.overview.avgOrderValue.toFixed(2)}
            </div>
            <div className="text-xs text-warning">-2.1% vs last week</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              ${conversionData.overview.revenue.toLocaleString()}
            </div>
            <div className="text-xs text-success">+12.4% growth</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Conversion Funnel
            </CardTitle>
            <CardDescription className="text-sm">
              User journey from landing to conversion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {conversionData.conversionFunnel.map((stage) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {stage.stage}
                  </span>
                  <span className="text-muted-foreground">{stage.rate}%</span>
                </div>
                <div className="relative">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stage.color} transition-all duration-500`}
                      style={{ width: `${stage.rate}%` }}
                    />
                  </div>
                  <div className="absolute -top-1 right-0 text-xs text-muted-foreground">
                    {stage.count.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Converting Campaigns */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Top Converting Campaigns
            </CardTitle>
            <CardDescription className="text-sm">
              Best performing campaigns by conversion rate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {conversionData.topCampaigns.map((campaign, index) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-3 border border-border rounded-md bg-card/30"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
                    #{index + 1}
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-foreground">
                      {campaign.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {campaign.id} • {campaign.conversions} conversions
                    </div>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant="success" className="text-xs">
                    {campaign.rate}% CR
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    ${campaign.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border bg-muted/15">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">
                Conversion Optimization
              </div>
              <div className="text-xs text-muted-foreground">
                Analyze and optimize your conversion flows
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                A/B Test Setup
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Funnel Analysis
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Attribution Model
              </Button>
              <Button size="sm" className="text-xs">
                Optimize Flow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversionsPage;
