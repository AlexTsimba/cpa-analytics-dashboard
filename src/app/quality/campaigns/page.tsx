/**
 * Campaign Quality Analysis Page
 *
 * Detailed campaign quality metrics and performance analysis
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

// Simulated campaign quality data
const campaignQualityData = {
  overview: {
    totalCampaigns: 47,
    highQuality: 32,
    mediumQuality: 12,
    lowQuality: 3,
    avgQualityScore: 84.2,
  },
  campaigns: [
    {
      id: 'CMP-001',
      name: 'Finance Offers Q2',
      status: 'active',
      qualityScore: 92,
      fraudRate: 1.2,
      validTraffic: 98.8,
      botTraffic: 0.9,
      suspiciousClicks: 0.3,
      geoCompliance: 99.1,
      deviceFingerprint: 96.7,
      clickPattern: 94.5,
      conversionRate: 4.2,
      revenue: 34629.5,
    },
    {
      id: 'CMP-004',
      name: 'Crypto Edu Native',
      status: 'active',
      qualityScore: 89,
      fraudRate: 1.8,
      validTraffic: 98.2,
      botTraffic: 1.3,
      suspiciousClicks: 0.5,
      geoCompliance: 97.8,
      deviceFingerprint: 95.2,
      clickPattern: 91.3,
      conversionRate: 5.1,
      revenue: 29016.0,
    },
    {
      id: 'CMP-002',
      name: 'Gaming Mobile Push',
      status: 'review',
      qualityScore: 85,
      fraudRate: 2.1,
      validTraffic: 97.9,
      botTraffic: 1.7,
      suspiciousClicks: 0.4,
      geoCompliance: 96.5,
      deviceFingerprint: 93.8,
      clickPattern: 89.2,
      conversionRate: 3.8,
      revenue: 25921.5,
    },
    {
      id: 'CMP-007',
      name: 'Health Supplements',
      status: 'active',
      qualityScore: 91,
      fraudRate: 1.4,
      validTraffic: 98.6,
      botTraffic: 1.0,
      suspiciousClicks: 0.4,
      geoCompliance: 98.3,
      deviceFingerprint: 96.1,
      clickPattern: 93.7,
      conversionRate: 3.9,
      revenue: 22040.5,
    },
    {
      id: 'CMP-012',
      name: 'Dating Tier1 Native',
      status: 'paused',
      qualityScore: 67,
      fraudRate: 4.8,
      validTraffic: 95.2,
      botTraffic: 3.2,
      suspiciousClicks: 1.6,
      geoCompliance: 89.4,
      deviceFingerprint: 78.9,
      clickPattern: 72.3,
      conversionRate: 2.1,
      revenue: 8934.25,
    },
  ],
};

const getQualityColor = (score: number) => {
  if (score >= 85) return 'success';
  if (score >= 70) return 'warning';
  return 'destructive';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'review':
      return 'warning';
    case 'paused':
      return 'secondary';
    default:
      return 'secondary';
  }
};

const CampaignQualityPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Campaign Quality
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor and analyze quality metrics for all active campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="text-xs">
            Quality Rules
          </Button>
          <Button size="sm" className="text-xs">
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {campaignQualityData.overview.totalCampaigns}
            </div>
            <div className="text-xs text-muted-foreground">
              Active monitoring
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {campaignQualityData.overview.highQuality}
            </div>
            <div className="text-xs text-success">Score ≥ 85</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Medium Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {campaignQualityData.overview.mediumQuality}
            </div>
            <div className="text-xs text-warning">Score 70-84</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {campaignQualityData.overview.lowQuality}
            </div>
            <div className="text-xs text-destructive">Score &lt; 70</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {campaignQualityData.overview.avgQualityScore}
            </div>
            <div className="text-xs text-success">+2.1 improvement</div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Quality Table */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Campaign Quality Analysis
          </CardTitle>
          <CardDescription className="text-sm">
            Detailed quality metrics and fraud detection for each campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaignQualityData.campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="border border-border rounded-lg p-4 bg-card/30"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">
                        {campaign.name}
                      </h3>
                      <Badge
                        variant={getStatusColor(campaign.status)}
                        className="text-xs"
                      >
                        {campaign.status}
                      </Badge>
                      <Badge
                        variant={getQualityColor(campaign.qualityScore)}
                        className="text-xs"
                      >
                        Score: {campaign.qualityScore}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {campaign.id} • {campaign.conversionRate}% CR • $
                      {campaign.revenue.toLocaleString()} revenue
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="text-xs">
                      Details
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs">
                      Optimize
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Fraud Rate
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {campaign.fraudRate}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Valid Traffic
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {campaign.validTraffic}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Bot Traffic
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {campaign.botTraffic}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Geo Compliance
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {campaign.geoCompliance}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Device Score
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {campaign.deviceFingerprint}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      Click Pattern
                    </div>
                    <div className="text-sm font-medium text-foreground">
                      {campaign.clickPattern}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quality Management Tools */}
      <Card className="border-border bg-muted/15">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">
                Campaign Quality Management
              </div>
              <div className="text-xs text-muted-foreground">
                Tools for maintaining and improving campaign quality standards
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                Auto-Pause Rules
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Quality Alerts
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Whitelist/Blacklist
              </Button>
              <Button size="sm" className="text-xs">
                Bulk Optimize
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignQualityPage;
