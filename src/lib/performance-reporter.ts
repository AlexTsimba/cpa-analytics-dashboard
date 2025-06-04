/**
 * Performance Reporting and Alerting System
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import {
  checkPerformanceThresholds,
  compareWithBaseline,
  type PerformanceMetric,
  type PerformanceReport,
} from './performance';
import { getPerformanceConfig } from './performance-config';

export type PerformanceAlert = {
  type:
    | 'threshold_violation'
    | 'regression'
    | 'memory_spike'
    | 'consecutive_failure';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  metrics: PerformanceMetric[];
  timestamp: number;
  context: string;
};

export class PerformanceReporter {
  private alerts: PerformanceAlert[] = [];
  private config = getPerformanceConfig(process.env.NODE_ENV);

  constructor(private readonly outputDir: string = './performance-reports') {}

  /**
   * Generate comprehensive performance report
   */
  generateReport(report: PerformanceReport): {
    report: PerformanceReport;
    alerts: PerformanceAlert[];
    summary: string;
  } {
    this.alerts = [];

    // Check threshold violations
    this.checkThresholds(report.metrics);

    // Check for regressions against baseline
    this.checkRegressions(report.metrics);

    // Check memory usage
    this.checkMemoryUsage(report);

    // Generate summary
    const summary = this.generateSummary(report);

    // Save report if configured
    if (this.config.alerts.channels.includes('file')) {
      this.saveReportToFile(report, summary);
    }

    // Output to console if configured
    if (this.config.alerts.channels.includes('console')) {
      this.outputToConsole(summary);
    }

    return {
      report,
      alerts: this.alerts,
      summary,
    };
  }

  private checkThresholds(metrics: PerformanceMetric[]): void {
    const flatThresholds = this.flattenThresholds();
    const result = checkPerformanceThresholds(metrics, flatThresholds);

    if (!result.passed) {
      this.alerts.push({
        type: 'threshold_violation',
        severity: 'high',
        message: `Performance threshold violations detected: ${result.violations.join(', ')}`,
        metrics: metrics.filter((m) =>
          result.violations.some((v) => v.includes(m.name))
        ),
        timestamp: Date.now(),
        context: 'threshold_check',
      });
    }
  }

  private checkRegressions(metrics: PerformanceMetric[]): void {
    const baseline = this.loadBaseline();
    if (!baseline) return;

    const comparison = compareWithBaseline(
      metrics,
      baseline,
      this.config.alerts.thresholds.regression_percent
    );

    if (comparison.regressions.length > 0) {
      this.alerts.push({
        type: 'regression',
        severity: 'medium',
        message: `Performance regressions detected: ${comparison.regressions.join(', ')}`,
        metrics: metrics.filter((m) =>
          comparison.regressions.some((r) => r.includes(m.name))
        ),
        timestamp: Date.now(),
        context: 'regression_check',
      });
    }
  }

  private checkMemoryUsage(report: PerformanceReport): void {
    const memoryThresholds = this.config.thresholds.memory;
    const { memoryUsage } = report.summary;

    const violations: string[] = [];

    if (memoryUsage.heapUsed > memoryThresholds.heap_used.max) {
      violations.push(
        `Heap usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`
      );
    }

    if (memoryUsage.rss > memoryThresholds.rss.max) {
      violations.push(`RSS: ${Math.round(memoryUsage.rss / 1024 / 1024)}MB`);
    }

    if (violations.length > 0) {
      this.alerts.push({
        type: 'memory_spike',
        severity: 'high',
        message: `Memory usage exceeded thresholds: ${violations.join(', ')}`,
        metrics: [],
        timestamp: Date.now(),
        context: 'memory_check',
      });
    }
  }
  private generateSummary(report: PerformanceReport): string {
    const { summary, phases } = report;
    const alertCount = this.alerts.length;
    const criticalAlerts = this.alerts.filter(
      (a) => a.severity === 'critical'
    ).length;

    let summaryText = `# Performance Report\n\n`;
    summaryText += `**Generated**: ${new Date(summary.timestamp).toISOString()}\n`;
    summaryText += `**Environment**: ${summary.environment}\n`;
    summaryText += `**Total Duration**: ${Math.round(summary.totalDuration)}ms\n`;
    summaryText += `**Memory Usage**: ${Math.round(summary.memoryUsage.heapUsed / 1024 / 1024)}MB heap\n\n`;

    // Alert summary
    if (alertCount > 0) {
      summaryText += `## 🚨 Alerts (${alertCount})\n`;
      if (criticalAlerts > 0) {
        summaryText += `**Critical**: ${criticalAlerts}\n`;
      }
      for (const alert of this.alerts) {
        summaryText += `- **${alert.type}** (${alert.severity}): ${alert.message}\n`;
      }
      summaryText += `\n`;
    } else {
      summaryText += `## ✅ No Performance Issues Detected\n\n`;
    }

    // Phase breakdown
    summaryText += `## Phase Performance\n`;
    for (const [phaseName, phase] of Object.entries(phases)) {
      summaryText += `- **${phaseName}**: ${Math.round(phase.duration)}ms\n`;
    }

    return summaryText;
  }

  private flattenThresholds(): Record<string, { max?: number; min?: number }> {
    const { thresholds } = this.config;
    return {
      ...Object.fromEntries(
        Object.entries(thresholds.pipeline).map(([key, value]) => [key, value])
      ),
      ...Object.fromEntries(
        Object.entries(thresholds.memory).map(([key, value]) => [key, value])
      ),
      ...Object.fromEntries(
        Object.entries(thresholds.tests).map(([key, value]) => [key, value])
      ),
    };
  }

  private loadBaseline(): PerformanceMetric[] | null {
    try {
      const baselinePath = join(this.outputDir, 'baseline.json');
      if (!existsSync(baselinePath)) return null;

      const fileContent = readFileSync(baselinePath, 'utf-8');
      const baseline = JSON.parse(fileContent) as { metrics?: PerformanceMetric[] };
      return baseline.metrics ?? [];
    } catch {
      return null;
    }
  }

  private saveReportToFile(report: PerformanceReport, summary: string): void {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const reportPath = join(this.outputDir, `performance-${timestamp}.json`);
      const summaryPath = join(this.outputDir, `summary-${timestamp}.md`);

      writeFileSync(reportPath, JSON.stringify(report, null, 2));
      writeFileSync(summaryPath, summary);
    } catch (error) {
      console.warn('Failed to save performance report:', error);
    }
  }

  private outputToConsole(summary: string): void {
    console.warn(`\n${summary}`);

    if (this.alerts.length > 0) {
      console.warn('\n🚨 Performance Alerts:');
      for (const alert of this.alerts) {
        console.warn(`  ${alert.severity.toUpperCase()}: ${alert.message}`);
      }
    }
  }
}
