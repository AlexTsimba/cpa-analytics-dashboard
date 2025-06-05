/**
 * Funnel Analysis Page
 *
 * Detailed conversion funnel analysis and optimization tools
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

// Simulated funnel data
const funnelData = {
  overview: {
    totalFunnels: 12,
    activeFunnels: 8,
    avgConversionRate: 3.42,
    bestPerforming: 'Finance Offer Flow A',
  },
  funnels: [
    {
      id: 'FUN-001',
      name: 'Finance Offer Flow A',
      campaign: 'Finance Offers Q2',
      status: 'active',
      steps: [
        { name: 'Landing Page', visitors: 12450, rate: 100, dropoff: 0 },
        { name: 'Interest Form', visitors: 8934, rate: 71.8, dropoff: 28.2 },
        {
          name: 'Email Verification',
          visitors: 6245,
          rate: 50.2,
          dropoff: 21.6,
        },
        { name: 'Document Upload', visitors: 4387, rate: 35.2, dropoff: 15.0 },
        { name: 'Final Approval', visitors: 2891, rate: 23.2, dropoff: 12.0 },
        { name: 'Conversion', visitors: 1845, rate: 14.8, dropoff: 8.4 },
      ],
    },
    {
      id: 'FUN-002',
      name: 'Crypto Education Flow',
      campaign: 'Crypto Edu Native',
      status: 'active',
      steps: [
        { name: 'Video Landing', visitors: 8920, rate: 100, dropoff: 0 },
        { name: 'Quiz Interaction', visitors: 6234, rate: 69.9, dropoff: 30.1 },
        { name: 'Email Capture', visitors: 4567, rate: 51.2, dropoff: 18.7 },
        { name: 'Course Signup', visitors: 3421, rate: 38.4, dropoff: 12.8 },
        { name: 'Payment Page', visitors: 2134, rate: 23.9, dropoff: 14.5 },
        { name: 'Purchase Complete', visitors: 1289, rate: 14.4, dropoff: 9.5 },
      ],
    },
  ],
  optimization: [
    {
      step: 'Email Verification',
      currentRate: 70.2,
      optimizedRate: 82.5,
      impact: '+12.3%',
      effort: 'Medium',
      priority: 'High',
    },
    {
      step: 'Document Upload',
      currentRate: 65.8,
      optimizedRate: 78.1,
      impact: '+12.3%',
      effort: 'High',
      priority: 'Medium',
    },
    {
      step: 'Payment Page',
      currentRate: 87.4,
      optimizedRate: 92.1,
      impact: '+4.7%',
      effort: 'Low',
      priority: 'High',
    },
  ],
};

const getDropoffColor = (dropoff: number) => {
  if (dropoff <= 10) return 'bg-success/20 text-success';
  if (dropoff <= 20) return 'bg-warning/20 text-warning';
  return 'bg-destructive/20 text-destructive';
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'secondary';
    default:
      return 'secondary';
  }
};

const FunnelAnalysisPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Funnel Analysis
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze conversion funnels and identify optimization opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="text-xs">
            Create Funnel
          </Button>
          <Button size="sm" className="text-xs">
            A/B Test Setup
          </Button>
        </div>
      </div>

      {/* Funnel Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Funnels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {funnelData.overview.totalFunnels}
            </div>
            <div className="text-xs text-muted-foreground">
              {funnelData.overview.activeFunnels} active
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Conversion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">
              {funnelData.overview.avgConversionRate}%
            </div>
            <div className="text-xs text-success">+0.8% this week</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Performer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-sm font-semibold text-foreground">
              {funnelData.overview.bestPerforming}
            </div>
            <div className="text-xs text-success">14.8% conversion</div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Optimization Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-semibold text-foreground">B+</div>
            <div className="text-xs text-warning">Room for improvement</div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Analysis */}
      {funnelData.funnels.map((funnel) => (
        <Card key={funnel.id} className="border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">
                  {funnel.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {funnel.campaign} • {funnel.id}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-xs">
                  {funnel.status}
                </Badge>
                <Button size="sm" variant="outline" className="text-xs">
                  Optimize
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnel.steps.map((step, index) => (
                <div key={step.name} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-foreground">
                    {step.name}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">
                        {step.visitors.toLocaleString()} visitors
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {step.rate}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-chart-1 transition-all duration-500"
                          style={{ width: `${step.rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  {step.dropoff > 0 && (
                    <div
                      className={`px-2 py-1 rounded text-xs ${getDropoffColor(step.dropoff)}`}
                    >
                      -{step.dropoff}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Optimization Opportunities */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Optimization Opportunities
          </CardTitle>
          <CardDescription className="text-sm">
            Recommended improvements based on funnel analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {funnelData.optimization.map((opp) => (
              <div
                key={opp.step}
                className="flex items-center justify-between p-3 border border-border rounded-md bg-card/30"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {opp.step}
                    </span>
                    <Badge
                      variant={getPriorityColor(opp.priority)}
                      className="text-xs"
                    >
                      {opp.priority} Priority
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Current: {opp.currentRate}% → Optimized: {opp.optimizedRate}
                    %
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-sm font-medium text-success">
                    {opp.impact} impact
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {opp.effort} effort
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Funnel Tools */}
      <Card className="border-border bg-muted/15">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">
                Funnel Optimization Tools
              </div>
              <div className="text-xs text-muted-foreground">
                Advanced tools for funnel analysis and conversion optimization
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                Heatmap Analysis
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                User Journey
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                A/B Test Results
              </Button>
              <Button size="sm" className="text-xs">
                Smart Optimize
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunnelAnalysisPage;
