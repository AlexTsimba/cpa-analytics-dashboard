/**
 * Performance Dashboard Component
 *
 * Displays performance metrics and trends from CI/CD pipeline monitoring
 */

'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type PerformanceMetric = {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  phase?: string;
};

type PerformanceData = {
  summary: {
    totalDuration: number;
    memoryUsage: {
      heapUsed: number;
      rss: number;
      external: number;
    };
    timestamp: number;
    environment: string;
  };
  metrics: PerformanceMetric[];
  phases: Record<
    string,
    {
      duration: number;
      startTime: number;
      endTime: number;
    }
  >;
};

export const PerformanceDashboard = () => {
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading performance data
    // In a real implementation, this would fetch from an API or artifact storage
    const mockData: PerformanceData = {
      summary: {
        totalDuration: 234567,
        memoryUsage: {
          heapUsed: 45234567,
          rss: 67345678,
          external: 12345678,
        },
        timestamp: Date.now(),
        environment: 'ci',
      },
      metrics: [
        {
          name: 'dependency_install_duration',
          value: 45000,
          unit: 'ms',
          timestamp: Date.now(),
          phase: 'dependency_install',
        },
        {
          name: 'type_check_duration',
          value: 12000,
          unit: 'ms',
          timestamp: Date.now(),
          phase: 'type_check',
        },
        {
          name: 'lint_duration',
          value: 8500,
          unit: 'ms',
          timestamp: Date.now(),
          phase: 'lint',
        },
        {
          name: 'test_unit_duration',
          value: 34000,
          unit: 'ms',
          timestamp: Date.now(),
          phase: 'test_unit',
        },
        {
          name: 'build_duration',
          value: 67000,
          unit: 'ms',
          timestamp: Date.now(),
          phase: 'build',
        },
        {
          name: 'test_e2e_duration',
          value: 123000,
          unit: 'ms',
          timestamp: Date.now(),
          phase: 'test_e2e',
        },
      ],
      phases: {
        dependency_install: { duration: 45000, startTime: 0, endTime: 45000 },
        type_check: { duration: 12000, startTime: 45000, endTime: 57000 },
        lint: { duration: 8500, startTime: 57000, endTime: 65500 },
        test_unit: { duration: 34000, startTime: 65500, endTime: 99500 },
        build: { duration: 67000, startTime: 99500, endTime: 166500 },
        test_e2e: { duration: 123000, startTime: 166500, endTime: 289500 },
      },
    };

    // Simulate API call delay
    setTimeout(() => {
      setPerformanceData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDuration = (ms: number): string => {
    if (ms < 1000) {
      return `${ms}ms`;
    }
    if (ms < 60000) {
      return `${(ms / 1000).toFixed(1)}s`;
    }
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatMemory = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) {
      return `${mb.toFixed(1)}MB`;
    }
    return `${(mb / 1024).toFixed(1)}GB`;
  };

  const getPhaseStatus = (
    duration: number,
    phaseName: string
  ): 'success' | 'warning' | 'error' => {
    const thresholds: Record<string, number> = {
      dependency_install: 120000,
      type_check: 30000,
      lint: 15000,
      test_unit: 60000,
      build: 120000,
      test_e2e: 180000,
    };

    const threshold = thresholds[phaseName];
    if (!threshold) {
      return 'success';
    }

    if (duration > threshold * 1.5) {
      return 'error';
    }
    if (duration > threshold) {
      return 'warning';
    }
    return 'success';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Performance Dashboard</CardTitle>
            <CardDescription>Loading performance metrics...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
          <CardDescription>Error loading performance data</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!performanceData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Dashboard</CardTitle>
          <CardDescription>No performance data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pipeline Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(performanceData.summary.totalDuration)}
            </div>
            <p className="text-xs text-muted-foreground">
              Environment: {performanceData.summary.environment}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatMemory(performanceData.summary.memoryUsage.heapUsed)}
            </div>
            <p className="text-xs text-muted-foreground">
              RSS: {formatMemory(performanceData.summary.memoryUsage.rss)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(performanceData.summary.timestamp).toLocaleDateString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(performanceData.summary.timestamp).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Phase Performance Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Phase Performance</CardTitle>
          <CardDescription>
            Duration and status for each CI/CD phase
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(performanceData.phases).map(
              ([phaseName, phase]) => {
                const status = getPhaseStatus(phase.duration, phaseName);
                const statusColors = {
                  success: 'bg-green-100 text-green-800',
                  warning: 'bg-yellow-100 text-yellow-800',
                  error: 'bg-red-100 text-red-800',
                };

                return (
                  <div
                    key={phaseName}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status]}`}
                      >
                        {status.toUpperCase()}
                      </div>
                      <span className="font-medium capitalize">
                        {phaseName.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-sm font-mono">
                      {formatDuration(phase.duration)}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Metrics</CardTitle>
          <CardDescription>All collected performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Metric</th>
                  <th className="text-left py-2">Value</th>
                  <th className="text-left py-2">Phase</th>
                  <th className="text-left py-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {performanceData.metrics.map((metric, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 font-medium">{metric.name}</td>
                    <td className="py-2 font-mono">
                      {metric.value.toLocaleString()}
                      {metric.unit}
                    </td>
                    <td className="py-2">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {metric.phase || 'N/A'}
                      </span>
                    </td>
                    <td className="py-2 text-xs text-muted-foreground">
                      {new Date(metric.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
