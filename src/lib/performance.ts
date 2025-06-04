/**
 * Performance Monitoring Utilities
 *
 * This module provides comprehensive performance monitoring capabilities
 * for CI/CD pipeline and test execution tracking.
 */

import { performance, PerformanceObserver } from 'perf_hooks';

export type PerformanceMetric = {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'percent' | 'count';
  timestamp: number;
  tags?: Record<string, string>;
};

export type PerformanceReport = {
  summary: {
    totalDuration: number;
    memoryUsage: NodeJS.MemoryUsage;
    timestamp: number;
    environment: string;
  };
  metrics: PerformanceMetric[];
  phases: {
    [phaseName: string]: {
      duration: number;
      startTime: number;
      endTime: number;
      metrics: PerformanceMetric[];
    };
  };
};

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private phases = new Map<
    string,
    { startTime: number; metrics: PerformanceMetric[] }
  >();
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;

  constructor(private readonly context: string = 'default') {
    this.setupPerformanceObservers();
  }

  /**
   * Start monitoring performance for a specific phase
   */
  startPhase(phaseName: string): void {
    if (this.phases.has(phaseName)) {
      console.warn(`Phase "${phaseName}" is already active`);
      return;
    }

    const startTime = performance.now();
    this.phases.set(phaseName, {
      startTime,
      metrics: [],
    });

    performance.mark(`${phaseName}-start`);

    if (!this.isMonitoring) {
      this.startMonitoring();
    }
  }

  /**
   * End monitoring for a specific phase
   */
  endPhase(phaseName: string): number {
    const phase = this.phases.get(phaseName);
    if (!phase) {
      console.warn(`Phase "${phaseName}" was not started`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - phase.startTime;

    performance.mark(`${phaseName}-end`);
    performance.measure(phaseName, `${phaseName}-start`, `${phaseName}-end`);

    // Add duration metric
    this.addMetric({
      name: `${phaseName}_duration`,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
      tags: {
        phase: phaseName,
        context: this.context,
      },
    });

    this.phases.delete(phaseName);
    return duration;
  }

  /**
   * Add a custom performance metric
   */
  addMetric(metric: PerformanceMetric): void {
    this.metrics.push({
      ...metric,
      timestamp: metric.timestamp || Date.now(),
    });
  }

  /**
   * Measure memory usage at current point
   */
  measureMemory(label?: string): NodeJS.MemoryUsage {
    const memUsage = process.memoryUsage();

    if (label) {
      this.addMetric({
        name: `${label}_memory_rss`,
        value: memUsage.rss,
        unit: 'bytes',
        timestamp: Date.now(),
        tags: { type: 'memory', label },
      });

      this.addMetric({
        name: `${label}_memory_heap_used`,
        value: memUsage.heapUsed,
        unit: 'bytes',
        timestamp: Date.now(),
        tags: { type: 'memory', label },
      });
    }

    return memUsage;
  }

  /**
   * Measure execution time of a function
   */
  async measureFunction<T>(
    name: string,
    fn: () => Promise<T> | T,
    tags?: Record<string, string>
  ): Promise<{ result: T; duration: number }> {
    const startTime = performance.now();
    this.measureMemory(`${name}_start`);

    try {
      const result = await fn();
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.measureMemory(`${name}_end`);

      this.addMetric({
        name: `${name}_execution_time`,
        value: duration,
        unit: 'ms',
        timestamp: Date.now(),
        tags: {
          ...tags,
          function: name,
          context: this.context,
          status: 'success',
        },
      });

      return { result, duration };
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.addMetric({
        name: `${name}_execution_time`,
        value: duration,
        unit: 'ms',
        timestamp: Date.now(),
        tags: {
          ...tags,
          function: name,
          context: this.context,
          status: 'error',
        },
      });

      throw error;
    }
  }

  /**
   * Generate comprehensive performance report
   */
  generateReport(): PerformanceReport {
    const now = performance.now();
    const memoryUsage = process.memoryUsage();

    // Calculate phases summary
    const phasesReport: PerformanceReport['phases'] = {};

    // Process completed phases from metrics
    const phaseMetrics = this.metrics.filter((m) =>
      m.name.endsWith('_duration')
    );
    for (const metric of phaseMetrics) {
      const phaseName = metric.name.replace('_duration', '');
      phasesReport[phaseName] ??= {
          duration: metric.value,
          startTime: metric.timestamp - metric.value,
          endTime: metric.timestamp,
          metrics: this.metrics.filter(
            (m) =>
              m.tags?.['phase'] === phaseName || m.name.startsWith(phaseName)
          ),
        };
    }

    return {
      summary: {
        totalDuration: now,
        memoryUsage,
        timestamp: Date.now(),
        environment: process.env.NODE_ENV,
      },
      metrics: [...this.metrics],
      phases: phasesReport,
    };
  }

  /**
   * Export metrics in various formats
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    const report = this.generateReport();

    if (format === 'csv') {
      const headers = ['name', 'value', 'unit', 'timestamp', 'tags'];
      const rows = report.metrics.map((metric) => [
        metric.name,
        metric.value.toString(),
        metric.unit,
        metric.timestamp.toString(),
        JSON.stringify(metric.tags ?? {}),
      ]);

      return [headers, ...rows].map((row) => row.join(',')).join('\n');
    }

    return JSON.stringify(report, null, 2);
  }

  /**
   * Clear all collected metrics
   */
  reset(): void {
    this.metrics = [];
    this.phases.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }

  /**
   * Stop monitoring and cleanup
   */
  stop(): void {
    this.isMonitoring = false;
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
  }

  private setupPerformanceObservers(): void {
    // Observer for mark and measure events
    const markObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          this.addMetric({
            name: `measure_${entry.name}`,
            value: entry.duration,
            unit: 'ms',
            timestamp: Date.now(),
            tags: {
              type: 'measure',
              context: this.context,
            },
          });
        }
      }
    });

    try {
      markObserver.observe({ entryTypes: ['mark', 'measure'] });
      this.observers.push(markObserver);
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }
  }

  private startMonitoring(): void {
    this.isMonitoring = true;

    // Monitor garbage collection if available
    try {
      const gcObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.addMetric({
            name: 'gc_duration',
            value: entry.duration,
            unit: 'ms',
            timestamp: Date.now(),
            tags: {
              type: 'gc',
              kind:
                String(
                  (entry as { detail?: { kind?: unknown } }).detail?.kind
                ) || 'unknown',
              context: this.context,
            },
          });
        }
      });

      gcObserver.observe({ entryTypes: ['gc'] });
      this.observers.push(gcObserver);
    } catch (_error) {
      // GC observer not available in all environments
    }
  }
}

/**
 * Utility functions for common performance measurements
 */

/**
 * Create a performance monitor instance for CI/CD context
 */
export function createCIPerformanceMonitor(): PerformanceMonitor {
  return new PerformanceMonitor('ci-cd');
}

/**
 * Create a performance monitor instance for test context
 */
export function createTestPerformanceMonitor(): PerformanceMonitor {
  return new PerformanceMonitor('test');
}

/**
 * Measure function execution time with automatic cleanup
 */
export async function measureExecutionTime<T>(
  _name: string,
  fn: () => Promise<T> | T
): Promise<{ result: T; duration: number; memoryDelta: number }> {
  const startTime = performance.now();
  const startMemory = process.memoryUsage().heapUsed;

  const result = await fn();

  const endTime = performance.now();
  const endMemory = process.memoryUsage().heapUsed;
  const duration = endTime - startTime;
  const memoryDelta = endMemory - startMemory;

  return { result, duration, memoryDelta };
}

/**
 * Check if current performance is within acceptable thresholds
 */
export function checkPerformanceThresholds(
  metrics: PerformanceMetric[],
  thresholds: Record<string, { max?: number; min?: number }>
): { passed: boolean; violations: string[] } {
  const violations: string[] = [];

  for (const metric of metrics) {
    const threshold = thresholds[metric.name];
    if (!threshold) {
      continue;
    }

    if (threshold.max !== undefined && metric.value > threshold.max) {
      violations.push(
        `${metric.name} (${metric.value}${metric.unit}) exceeds maximum threshold (${threshold.max}${metric.unit})`
      );
    }

    if (threshold.min !== undefined && metric.value < threshold.min) {
      violations.push(
        `${metric.name} (${metric.value}${metric.unit}) below minimum threshold (${threshold.min}${metric.unit})`
      );
    }
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}

/**
 * Compare performance metrics with baseline
 */
export function compareWithBaseline(
  current: PerformanceMetric[],
  baseline: PerformanceMetric[],
  tolerancePercent: number = 10
): {
  regressions: string[];
  improvements: string[];
  unchanged: string[];
} {
  const regressions: string[] = [];
  const improvements: string[] = [];
  const unchanged: string[] = [];

  const baselineMap = new Map(baseline.map((m) => [m.name, m.value]));

  for (const metric of current) {
    const baselineValue = baselineMap.get(metric.name);
    if (baselineValue === undefined) {
      unchanged.push(`${metric.name} (new metric)`);
      continue;
    }

    const percentChange =
      ((metric.value - baselineValue) / baselineValue) * 100;

    if (Math.abs(percentChange) <= tolerancePercent) {
      unchanged.push(`${metric.name} (${percentChange.toFixed(1)}% change)`);
    } else if (percentChange > 0) {
      regressions.push(
        `${metric.name} increased by ${percentChange.toFixed(1)}% (${baselineValue}${metric.unit} → ${metric.value}${metric.unit})`
      );
    } else {
      improvements.push(
        `${metric.name} improved by ${Math.abs(percentChange).toFixed(1)}% (${baselineValue}${metric.unit} → ${metric.value}${metric.unit})`
      );
    }
  }

  return { regressions, improvements, unchanged };
}
