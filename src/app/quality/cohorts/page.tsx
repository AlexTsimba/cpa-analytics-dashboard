/**
 * Cohorts Analysis Page
 *
 * Detailed cohort analysis for user behavior and lifetime value tracking
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

// Simulated cohort data
const cohortData = {
  retention: [
    {
      cohort: 'Jan 2025',
      users: 2456,
      week1: 78.5,
      week2: 65.3,
      week3: 58.7,
      week4: 54.2,
      week8: 42.1,
      week12: 36.8,
    },
    {
      cohort: 'Feb 2025',
      users: 3421,
      week1: 82.1,
      week2: 69.4,
      week3: 62.8,
      week4: 57.9,
      week8: 45.3,
      week12: 39.2,
    },
    {
      cohort: 'Mar 2025',
      users: 2789,
      week1: 75.6,
      week2: 61.2,
      week3: 55.4,
      week4: 51.1,
      week8: 38.7,
      week12: 32.9,
    },
    {
      cohort: 'Apr 2025',
      users: 3854,
      week1: 80.3,
      week2: 67.8,
      week3: 60.1,
      week4: 55.7,
      week8: 43.2,
      week12: 37.6,
    },
  ],
  ltv: [
    {
      cohort: 'Jan 2025',
      users: 2456,
      week1: 12.5,
      week2: 28.75,
      week3: 45.2,
      week4: 67.8,
      week8: 125.4,
      week12: 189.75,
    },
    {
      cohort: 'Feb 2025',
      users: 3421,
      week1: 15.2,
      week2: 32.4,
      week3: 52.1,
      week4: 78.9,
      week8: 142.5,
      week12: 215.3,
    },
    {
      cohort: 'Mar 2025',
      users: 2789,
      week1: 9.8,
      week2: 21.6,
      week3: 38.4,
      week4: 58.2,
      week8: 98.7,
      week12: 145.8,
    },
    {
      cohort: 'Apr 2025',
      users: 3854,
      week1: 14.7,
      week2: 31.2,
      week3: 49.8,
      week4: 74.6,
      week8: 134.9,
      week12: 198.4,
    },
  ],
};

const getRetentionColor = (rate: number) => {
  if (rate >= 60) return 'bg-success text-success-foreground';
  if (rate >= 40) return 'bg-warning text-warning-foreground';
  return 'bg-destructive text-destructive-foreground';
};

const CohortsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Cohort Analysis
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track user behavior and lifetime value across different cohorts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="text-xs">
            Export Cohorts
          </Button>
          <Button size="sm" className="text-xs">
            Create Cohort
          </Button>
        </div>
      </div>

      {/* Retention Cohort Table */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Retention Cohorts
          </CardTitle>
          <CardDescription className="text-sm">
            User retention rates by acquisition cohort over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-foreground">
                    Cohort
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                    Users
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                    Week 1
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                    Week 2
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                    Week 3
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                    Week 4
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                    Week 8
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                    Week 12
                  </th>
                </tr>
              </thead>
              <tbody>
                {cohortData.retention.map((row) => (
                  <tr key={row.cohort} className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium text-foreground">
                      {row.cohort}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {row.users.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge
                        className={`text-xs ${getRetentionColor(row.week1)}`}
                      >
                        {row.week1}%
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge
                        className={`text-xs ${getRetentionColor(row.week2)}`}
                      >
                        {row.week2}%
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge
                        className={`text-xs ${getRetentionColor(row.week3)}`}
                      >
                        {row.week3}%
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge
                        className={`text-xs ${getRetentionColor(row.week4)}`}
                      >
                        {row.week4}%
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge
                        className={`text-xs ${getRetentionColor(row.week8)}`}
                      >
                        {row.week8}%
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge
                        className={`text-xs ${getRetentionColor(row.week12)}`}
                      >
                        {row.week12}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* LTV Cohort Table */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">
            Lifetime Value Cohorts
          </CardTitle>
          <CardDescription className="text-sm">
            Average revenue per user by cohort over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium text-foreground">
                    Cohort
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                    Users
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                    Week 1
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                    Week 2
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                    Week 3
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                    Week 4
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                    Week 8
                  </th>
                  <th className="text-center py-3 px-2 font-medium text-muted-foreground">
                    Week 12
                  </th>
                </tr>
              </thead>
              <tbody>
                {cohortData.ltv.map((row) => (
                  <tr key={row.cohort} className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium text-foreground">
                      {row.cohort}
                    </td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {row.users.toLocaleString()}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-foreground">
                      ${row.week1.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-foreground">
                      ${row.week2.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-foreground">
                      ${row.week3.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-foreground">
                      ${row.week4.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-foreground">
                      ${row.week8.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-foreground">
                      ${row.week12.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cohort Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Performing Cohort
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg font-semibold text-foreground">
              Feb 2025
            </div>
            <div className="text-xs text-success">82.1% Week 1 retention</div>
            <div className="text-xs text-muted-foreground">
              $215.30 LTV at Week 12
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Retention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg font-semibold text-foreground">79.1%</div>
            <div className="text-xs text-success">+2.3% vs last period</div>
            <div className="text-xs text-muted-foreground">
              Week 1 retention rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average LTV
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-lg font-semibold text-foreground">$187.31</div>
            <div className="text-xs text-success">+8.7% growth</div>
            <div className="text-xs text-muted-foreground">12-week average</div>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Tools */}
      <Card className="border-border bg-muted/15">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-sm font-medium text-foreground">
                Cohort Management Tools
              </div>
              <div className="text-xs text-muted-foreground">
                Advanced cohort analysis and segmentation tools
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="text-xs">
                Segment Builder
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Custom Periods
              </Button>
              <Button size="sm" variant="outline" className="text-xs">
                Compare Cohorts
              </Button>
              <Button size="sm" className="text-xs">
                Advanced Analysis
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CohortsPage;
