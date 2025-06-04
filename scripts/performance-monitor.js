#!/usr/bin/env node

/**
 * GitHub Actions Performance Monitor
 *
 * Integrates performance monitoring into CI/CD pipeline
 * Usage: node scripts/performance-monitor.js <phase-name>
 */

import { performance } from 'perf_hooks';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PERFORMANCE_DIR = join(process.cwd(), '.performance');
const ARTIFACTS_DIR = join(process.cwd(), 'performance-artifacts');

// Ensure directories exist
[PERFORMANCE_DIR, ARTIFACTS_DIR].forEach((dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

class CIPerformanceMonitor {
  constructor() {
    this.startTime = performance.now();
    this.metrics = [];
    this.phase = process.argv[2] || 'unknown';
    this.isCI = process.env.CI === 'true';
  }

  startPhase(phaseName = this.phase) {
    const timestamp = Date.now();
    const startTime = performance.now();

    console.log(`🚀 Starting performance monitoring for: ${phaseName}`);

    // Store phase start info
    const phaseData = {
      name: phaseName,
      startTime,
      timestamp,
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        CI: process.env.CI,
        GITHUB_ACTIONS: process.env.GITHUB_ACTIONS,
        GITHUB_SHA: process.env.GITHUB_SHA,
        GITHUB_REF: process.env.GITHUB_REF,
        RUNNER_OS: process.env.RUNNER_OS,
      },
    };

    const phaseFile = join(PERFORMANCE_DIR, `${phaseName}-start.json`);
    writeFileSync(phaseFile, JSON.stringify(phaseData, null, 2));

    // Set GitHub Actions output
    if (this.isCI) {
      this.setGitHubOutput('phase_start_time', startTime.toString());
      this.setGitHubOutput('phase_name', phaseName);
    }

    return startTime;
  }

  endPhase(phaseName = this.phase) {
    const endTime = performance.now();
    const timestamp = Date.now();

    // Load phase start data
    const phaseFile = join(PERFORMANCE_DIR, `${phaseName}-start.json`);
    if (!existsSync(phaseFile)) {
      console.error(`❌ Phase start data not found for: ${phaseName}`);
      return null;
    }

    const phaseStartData = JSON.parse(readFileSync(phaseFile, 'utf-8'));
    const duration = endTime - phaseStartData.startTime;
    const memoryUsage = process.memoryUsage();

    const phaseResult = {
      ...phaseStartData,
      endTime,
      duration,
      memoryUsage,
      endTimestamp: timestamp,
      status: 'completed',
    };

    // Save phase result
    const resultFile = join(PERFORMANCE_DIR, `${phaseName}-result.json`);
    writeFileSync(resultFile, JSON.stringify(phaseResult, null, 2));

    // Add to metrics collection
    this.addMetric({
      name: `${phaseName}_duration`,
      value: duration,
      unit: 'ms',
      timestamp,
      phase: phaseName,
    });

    this.addMetric({
      name: `${phaseName}_memory_peak`,
      value: memoryUsage.heapUsed,
      unit: 'bytes',
      timestamp,
      phase: phaseName,
    });

    console.log(`✅ Phase completed: ${phaseName} (${Math.round(duration)}ms)`);
    console.log(
      `📊 Memory usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`
    );

    // Set GitHub Actions outputs
    if (this.isCI) {
      this.setGitHubOutput('phase_duration', Math.round(duration).toString());
      this.setGitHubOutput(
        'phase_memory_mb',
        Math.round(memoryUsage.heapUsed / 1024 / 1024).toString()
      );
      this.addGitHubSummary(
        `### ${phaseName} Performance\n- Duration: ${Math.round(duration)}ms\n- Memory: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB\n`
      );
    }

    return phaseResult;
  }
  addMetric(metric) {
    this.metrics.push({
      ...metric,
      timestamp: metric.timestamp || Date.now(),
    });
  }

  generateReport() {
    const totalDuration = performance.now() - this.startTime;
    const memoryUsage = process.memoryUsage();

    const report = {
      summary: {
        totalDuration,
        memoryUsage,
        timestamp: Date.now(),
        environment: process.env.NODE_ENV || 'development',
        ci: this.isCI,
        phase: this.phase,
      },
      metrics: this.metrics,
      system: {
        platform: process.platform,
        nodeVersion: process.version,
        cpuCount: require('os').cpus().length,
        totalMemory: require('os').totalmem(),
      },
    };

    // Save full report
    const reportFile = join(
      ARTIFACTS_DIR,
      `performance-${this.phase}-${Date.now()}.json`
    );
    writeFileSync(reportFile, JSON.stringify(report, null, 2));

    console.log(`📋 Performance report saved: ${reportFile}`);
    return report;
  }

  checkThresholds() {
    const thresholds = {
      dependency_install: 120000, // 2 minutes
      type_check: 30000, // 30 seconds
      lint: 15000, // 15 seconds
      test_unit: 60000, // 1 minute
      test_e2e: 180000, // 3 minutes
      build: 120000, // 2 minutes
    };

    const violations = [];

    for (const metric of this.metrics) {
      if (metric.name.endsWith('_duration')) {
        const phaseName = metric.name.replace('_duration', '');
        const threshold = thresholds[phaseName];

        if (threshold && metric.value > threshold) {
          violations.push({
            phase: phaseName,
            actual: Math.round(metric.value),
            threshold,
            exceeded: Math.round(metric.value - threshold),
          });
        }
      }
    }

    if (violations.length > 0) {
      console.log('⚠️  Performance threshold violations:');
      for (const violation of violations) {
        console.log(
          `   ${violation.phase}: ${violation.actual}ms (exceeded by ${violation.exceeded}ms)`
        );
      }

      if (this.isCI) {
        this.addGitHubSummary('## ⚠️ Performance Threshold Violations\n');
        for (const violation of violations) {
          this.addGitHubSummary(
            `- **${violation.phase}**: ${violation.actual}ms (threshold: ${violation.threshold}ms)\n`
          );
        }
      }
    }

    return violations;
  }

  setGitHubOutput(name, value) {
    if (process.env.GITHUB_OUTPUT) {
      const fs = require('fs');
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
    }
  }

  addGitHubSummary(content) {
    if (process.env.GITHUB_STEP_SUMMARY) {
      const fs = require('fs');
      fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, content);
    }
  }
}

// CLI Usage
const command = process.argv[2];
const phaseName = process.argv[3] || command;

const monitor = new CIPerformanceMonitor();

switch (command) {
  case 'start':
    monitor.startPhase(phaseName);
    break;

  case 'end':
    monitor.endPhase(phaseName);
    monitor.generateReport();
    monitor.checkThresholds();
    break;

  case 'report':
    monitor.generateReport();
    break;

  default:
    console.log(
      'Usage: node performance-monitor.js <start|end|report> [phase-name]'
    );
    console.log('Examples:');
    console.log('  node performance-monitor.js start build');
    console.log('  node performance-monitor.js end build');
    console.log('  node performance-monitor.js report');
    process.exit(1);
}
