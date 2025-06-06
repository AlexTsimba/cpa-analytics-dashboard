/**
 * Quality Analysis Page
 *
 * Professional traffic quality analysis with cohorts and campaign insights
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

// Simulated quality data
const qualityData = {
  overview: {
    overallScore: 87,
    fraudRate: 2.3,
    validTraffic: 97.7,
    qualityTrend: '+4.2%',
  },
  cohorts: [
    {
      name: 'Week 1 - Mobile iOS',
      size: 2456,
      retention: 78.5,
      ltv: 145.3,
      quality: 'high',
      conversionRate: 4.2,
    },
    {
      name: 'Week 2 - Desktop Chrome',
      size: 1834,
      retention: 82.1,
      ltv: 189.75,
      quality: 'high',
      conversionRate: 5.1,
    },
    {
      name: 'Week 3 - Mobile Android',
      size: 3421,
      retention: 65.4,
      ltv: 98.2,
      quality: 'medium',
      conversionRate: 2.8,
    },
    {
      name: 'Week 4 - Mobile iOS',
      size: 2789,
      retention: 71.2,
      ltv: 134.65,
      quality: 'high',
      conversionRate: 3.9,
    },
  ],
  campaignQuality: [
    {
      id: 'CMP-001',
      name: 'Finance Offers Q2',
      score: 92,
      fraudRate: 1.2,
      validClicks: 98.8,
    },
    {
      id: 'CMP-004',
      name: 'Crypto Edu Native',
      score: 89,
      fraudRate: 1.8,
      validClicks: 98.2,
    },
    {
      id: 'CMP-002',
      name: 'Gaming Mobile Push',
      score: 85,
      fraudRate: 2.1,
      validClicks: 97.9,
    },
    {
      id: 'CMP-007',
      name: 'Health Supplements',
      score: 91,
      fraudRate: 1.4,
      validClicks: 98.6,
    },
  ],
  trafficSources: [
    { source: 'Facebook Ads', quality: 88, fraudRate: 1.9, volume: 12450 },
    { source: 'Google Ads', quality: 92, fraudRate: 1.1, volume: 8920 },
    { source: 'TikTok Ads', quality: 79, fraudRate: 3.2, volume: 6780 },
    { source: 'Native Networks', quality: 85, fraudRate: 2.4, volume: 4560 },
  ],
};

const getQualityColor = (quality: string | number) => {
  if (typeof quality === 'string') {
    switch (quality) {
      case 'high':
        return 'success';
      case 'medium':
        return 'warning';
      case 'low':
        return 'destructive';
      default:
        return 'secondary';
    }
  } else {
    if (quality >= 85) return 'success';
    if (quality >= 70) return 'warning';
    return 'destructive';
  }
};

const QualityPage = () => {
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        <Button size="sm" variant="outline" className="text-xs">
          Quality Report
        </Button>
        <Button size="sm" className="text-xs">
          Setup Filters
        </Button>
      </div>

      {/* Quality Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {qualityData.overview.overallScore}
            </div>
            <div className="text-xs text-success">
              {qualityData.overview.qualityTrend} improvement
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fraud Rate
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {qualityData.overview.fraudRate}%
            </div>
            <div className="text-xs text-success">-0.8% vs last week</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valid Traffic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {qualityData.overview.validTraffic}%
            </div>
            <div className="text-xs text-success">+0.8% improvement</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Quality Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              Excellent
            </div>
            <div className="text-xs text-success">Trending upward</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort Analysis */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Cohort Performance
            </CardTitle>
            <CardDescription className="text-sm">
              User cohorts grouped by acquisition period and behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {qualityData.cohorts.map((cohort) => (
              <div
                key={cohort.name}
                className="flex items-center justify-between p-3 border border-border rounded-md bg-card/30"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {cohort.name}
                    </span>
                    <Badge
                      variant={getQualityColor(cohort.quality)}
                      className="text-xs"
                    >
                      {cohort.quality}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cohort.size.toLocaleString()} users • {cohort.retention}%
                    retention
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-medium text-foreground">
                    ${cohort.ltv.toFixed(2)} LTV
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cohort.conversionRate}% CR
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Campaign Quality */}
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Campaign Quality Scores
            </CardTitle>
            <CardDescription className="text-sm">
              Quality assessment by campaign performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {qualityData.campaignQuality.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-3 border border-border rounded-md bg-card/30"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {campaign.name}
                    </span>
                    <Badge
                      variant={getQualityColor(campaign.score)}
                      className="text-xs"
                    >
                      Score: {campaign.score}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {campaign.id} • {campaign.fraudRate}% fraud rate
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-medium text-foreground">
                    {campaign.validClicks}% valid
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Quality check
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Traffic Source Quality */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Traffic Source Quality
          </CardTitle>
          <CardDescription className="text-sm">
            Quality metrics by traffic source and volume
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualityData.trafficSources.map((source) => (
              <div
                key={source.source}
                className="flex items-center justify-between p-4 border border-border rounded-md bg-card/30"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {source.source}
                    </span>
                    <Badge
                      variant={getQualityColor(source.quality)}
                      className="text-xs"
                    >
                      Q: {source.quality}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {source.volume.toLocaleString()} clicks • {source.fraudRate}
                    % fraud
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-foreground">
                    {source.quality}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Quality Score
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Actions */}
      <Card className="border-border bg-muted/15">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">
                Quality Management
              </div>
              <div className="text-xs text-muted-foreground">
                Advanced tools for maintaining traffic quality
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                Block IP Range
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Fraud Detection
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Cohort Builder
              </Button>
              <Button size="sm" className="text-xs">
                Quality Rules
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityPage;
