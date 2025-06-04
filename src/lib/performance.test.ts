/**
 * Performance Monitoring Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  PerformanceMonitor,
  createCIPerformanceMonitor,
  measureExecutionTime,
  checkPerformanceThresholds,
  compareWithBaseline,
  type PerformanceMetric,
} from '@/lib/performance';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor('test');
  });

  afterEach(() => {
    monitor.stop();
  });

  it('should start and end a phase successfully', () => {
    monitor.startPhase('test-phase');

    // Simulate some work
    const start = Date.now();
    while (Date.now() - start < 10) {
      // Busy wait for 10ms
    }

    const duration = monitor.endPhase('test-phase');

    expect(duration).toBeGreaterThan(0);
    expect(duration).toBeGreaterThanOrEqual(10);
  });

  it('should handle ending non-existent phase gracefully', () => {
    const duration = monitor.endPhase('non-existent');
    expect(duration).toBe(0);
  });

  it('should add custom metrics', () => {
    const metric: PerformanceMetric = {
      name: 'test-metric',
      value: 100,
      unit: 'ms',
      timestamp: Date.now(),
    };

    monitor.addMetric(metric);
    const report = monitor.generateReport();

    expect(report.metrics).toContainEqual(expect.objectContaining(metric));
  });

  it('should measure memory usage', () => {
    const memory = monitor.measureMemory('test-memory');

    expect(memory).toHaveProperty('rss');
    expect(memory).toHaveProperty('heapUsed');
    expect(memory).toHaveProperty('heapTotal');
    expect(memory).toHaveProperty('external');

    expect(memory.rss).toBeGreaterThan(0);
    expect(memory.heapUsed).toBeGreaterThan(0);
  });
});

describe('Utility functions', () => {
  it('should create CI performance monitor', () => {
    const ciMonitor = createCIPerformanceMonitor();

    // Start and end a phase to generate a metric with context
    ciMonitor.startPhase('test-phase');
    ciMonitor.endPhase('test-phase');

    const report = ciMonitor.generateReport();
    const phaseMetric = report.metrics.find(
      (m) => m.name === 'test-phase_duration'
    );
    expect(phaseMetric?.tags?.['context']).toBe('ci-cd');

    ciMonitor.stop();
  });

  it('should measure execution time', async () => {
    const testFn = () => {
      const arr = new Array(100).fill(0);
      return arr.length;
    };

    const { result, duration, memoryDelta } = await measureExecutionTime(
      'test',
      testFn
    );

    expect(result).toBe(100);
    expect(duration).toBeGreaterThan(0);
    expect(typeof memoryDelta).toBe('number');
  });

  it('should check performance thresholds', () => {
    const metrics: PerformanceMetric[] = [
      { name: 'fast-operation', value: 100, unit: 'ms', timestamp: Date.now() },
    ];

    const thresholds = {
      'fast-operation': { max: 200 },
    };

    const result = checkPerformanceThresholds(metrics, thresholds);
    expect(result.passed).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('should compare with baseline', () => {
    const current: PerformanceMetric[] = [
      { name: 'build-time', value: 120, unit: 'ms', timestamp: Date.now() },
    ];

    const baseline: PerformanceMetric[] = [
      { name: 'build-time', value: 100, unit: 'ms', timestamp: Date.now() },
    ];

    const result = compareWithBaseline(current, baseline, 10);

    expect(result.regressions).toHaveLength(1);
    expect(result.regressions[0]).toContain('build-time');
    expect(result.regressions[0]).toContain('20.0%');
  });
});
