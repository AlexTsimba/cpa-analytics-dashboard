#!/usr/bin/env node

/**
 * Task Completion Report Generator
 * Generates comprehensive reports of task completion, test coverage, and quality metrics
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const TASKS_FILE = path.join(PROJECT_ROOT, 'tasks', 'tasks.json');
const QUALITY_GATES_FILE = path.join(PROJECT_ROOT, '.quality-gates.json');
const PACKAGE_JSON = path.join(PROJECT_ROOT, 'package.json');

class TaskCompletionReporter {
  constructor() {
    this.report = {
      generatedAt: new Date().toISOString(),
      projectStatus: {},
      tasksSummary: {},
      qualityMetrics: {},
      testCoverage: {},
      recommendations: [],
    };
  }

  async generateReport() {
    console.log('🚀 Generating Task Completion Report...');

    try {
      await this.analyzeProjectStatus();
      await this.analyzeTaskCompletion();
      await this.analyzeQualityMetrics();
      await this.analyzeTestCoverage();
      await this.generateRecommendations();

      const reportPath = path.join(
        PROJECT_ROOT,
        'docs',
        'task-completion-report.json'
      );
      const markdownReportPath = path.join(
        PROJECT_ROOT,
        'docs',
        'TASK_COMPLETION_REPORT.md'
      );

      // Ensure docs directory exists
      if (!fs.existsSync(path.join(PROJECT_ROOT, 'docs'))) {
        fs.mkdirSync(path.join(PROJECT_ROOT, 'docs'), { recursive: true });
      }

      fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
      fs.writeFileSync(markdownReportPath, this.generateMarkdownReport());

      console.log('✅ Task Completion Report generated successfully!');
      console.log(`📄 JSON Report: ${reportPath}`);
      console.log(`📝 Markdown Report: ${markdownReportPath}`);

      return this.report;
    } catch (error) {
      console.error('❌ Error generating report:', error.message);
      throw error;
    }
  }

  async analyzeProjectStatus() {
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON, 'utf8'));

    this.report.projectStatus = {
      name: packageJson.name || 'Dashboard Project',
      version: packageJson.version || '1.0.0',
      dependencies: {
        total: Object.keys(packageJson.dependencies || {}).length,
        devDependencies: Object.keys(packageJson.devDependencies || {}).length,
      },
      scripts: Object.keys(packageJson.scripts || {}),
      lastModified: fs.statSync(PACKAGE_JSON).mtime.toISOString(),
    };
  }

  async analyzeTaskCompletion() {
    if (!fs.existsSync(TASKS_FILE)) {
      this.report.tasksSummary = {
        error: 'Tasks file not found',
        path: TASKS_FILE,
      };
      return;
    }

    const tasksData = JSON.parse(fs.readFileSync(TASKS_FILE, 'utf8'));
    const tasks = tasksData.tasks || [];

    const stats = {
      total: tasks.length,
      completed: 0,
      inProgress: 0,
      pending: 0,
      blocked: 0,
      deferred: 0,
      cancelled: 0,
      subtasks: {
        total: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
      },
    };

    const taskDetails = [];

    tasks.forEach((task) => {
      stats[task.status] = (stats[task.status] || 0) + 1;

      const subtasks = task.subtasks || [];
      stats.subtasks.total += subtasks.length;

      subtasks.forEach((subtask) => {
        stats.subtasks[subtask.status] =
          (stats.subtasks[subtask.status] || 0) + 1;
      });

      taskDetails.push({
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        subtasksCount: subtasks.length,
        completedSubtasks: subtasks.filter((st) => st.status === 'done').length,
        complexityScore: task.complexityScore || 'Not assessed',
      });
    });

    stats.completionPercentage =
      tasks.length > 0 ? Math.round((stats.completed / tasks.length) * 100) : 0;

    stats.subtasks.completionPercentage =
      stats.subtasks.total > 0
        ? Math.round((stats.subtasks.completed / stats.subtasks.total) * 100)
        : 0;

    this.report.tasksSummary = {
      stats,
      taskDetails,
      lastUpdated: fs.statSync(TASKS_FILE).mtime.toISOString(),
    };
  }

  async analyzeQualityMetrics() {
    const qualityMetrics = {
      linting: await this.runCommand('npm run lint:check', 'ESLint check'),
      typeCheck: await this.runCommand(
        'npx tsc --noEmit',
        'TypeScript compilation'
      ),
      formatting: await this.runCommand(
        'npm run format:check',
        'Code formatting check'
      ),
      build: await this.runCommand('npm run build', 'Build process'),
    };

    // Check if quality gates file exists
    if (fs.existsSync(QUALITY_GATES_FILE)) {
      try {
        const qualityGates = JSON.parse(
          fs.readFileSync(QUALITY_GATES_FILE, 'utf8')
        );
        qualityMetrics.qualityGates = qualityGates;
      } catch (error) {
        qualityMetrics.qualityGatesError = error.message;
      }
    }

    this.report.qualityMetrics = qualityMetrics;
  }

  async analyzeTestCoverage() {
    const testCoverage = {
      unit: await this.runCommand('npm run test:run', 'Unit test execution'),
      e2e: await this.runCommand(
        'npm run test:e2e 2>/dev/null || echo "E2E tests not configured or failed"',
        'E2E test results'
      ),
    };

    // Try to read coverage report if it exists
    const coverageFile = path.join(
      PROJECT_ROOT,
      'coverage',
      'coverage-summary.json'
    );
    if (fs.existsSync(coverageFile)) {
      try {
        testCoverage.coverageData = JSON.parse(
          fs.readFileSync(coverageFile, 'utf8')
        );
      } catch (error) {
        testCoverage.coverageError = error.message;
      }
    }

    this.report.testCoverage = testCoverage;
  }

  async generateRecommendations() {
    const recommendations = [];
    const tasks = this.report.tasksSummary.taskDetails || [];

    // Task-based recommendations
    const pendingHighPriority = tasks.filter(
      (t) => t.status === 'pending' && t.priority === 'high'
    );
    if (pendingHighPriority.length > 0) {
      recommendations.push({
        type: 'tasks',
        priority: 'high',
        message: `${pendingHighPriority.length} high-priority tasks are still pending`,
        action: 'Focus on completing high-priority tasks first',
        tasks: pendingHighPriority.map((t) => `Task ${t.id}: ${t.title}`),
      });
    }

    // In-progress tasks without subtasks completion
    const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
    inProgressTasks.forEach((task) => {
      if (task.subtasksCount > 0 && task.completedSubtasks === 0) {
        recommendations.push({
          type: 'tasks',
          priority: 'medium',
          message: `Task ${task.id} is in progress but no subtasks are completed`,
          action: 'Break down the task or complete first subtasks',
        });
      }
    });

    // Quality-based recommendations
    if (this.report.qualityMetrics.linting?.success === false) {
      recommendations.push({
        type: 'quality',
        priority: 'medium',
        message: 'Linting issues detected',
        action: 'Run "npm run lint:fix" to resolve formatting issues',
      });
    }

    if (this.report.qualityMetrics.typeCheck?.success === false) {
      recommendations.push({
        type: 'quality',
        priority: 'high',
        message: 'TypeScript compilation errors detected',
        action: 'Fix TypeScript errors before proceeding',
      });
    }

    // Test coverage recommendations
    const coverage = this.report.testCoverage.coverageData;
    if (coverage && coverage.total && coverage.total.lines.pct < 80) {
      recommendations.push({
        type: 'testing',
        priority: 'medium',
        message: `Test coverage is ${coverage.total.lines.pct}% (below 80% threshold)`,
        action: 'Increase test coverage by adding more unit tests',
      });
    }

    // Project progress recommendations
    const completionRate =
      this.report.tasksSummary.stats?.completionPercentage || 0;
    if (completionRate < 25) {
      recommendations.push({
        type: 'progress',
        priority: 'high',
        message: `Project completion is only ${completionRate}%`,
        action: 'Focus on completing fundamental setup tasks first',
      });
    }

    this.report.recommendations = recommendations;
  }

  async runCommand(command, description) {
    try {
      const output = execSync(command, {
        cwd: PROJECT_ROOT,
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      return {
        description,
        command,
        success: true,
        output: output.trim(),
        executedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        description,
        command,
        success: false,
        error: error.message,
        stderr: error.stderr?.toString(),
        stdout: error.stdout?.toString(),
        executedAt: new Date().toISOString(),
      };
    }
  }

  generateMarkdownReport() {
    const { tasksSummary, qualityMetrics, testCoverage, recommendations } =
      this.report;

    return `# Task Completion Report

Generated on: ${new Date(this.report.generatedAt).toLocaleString()}

## 📊 Project Overview

- **Project Name**: ${this.report.projectStatus.name}
- **Version**: ${this.report.projectStatus.version}
- **Dependencies**: ${this.report.projectStatus.dependencies.total} production, ${this.report.projectStatus.dependencies.devDependencies} development
- **NPM Scripts**: ${this.report.projectStatus.scripts.length} available

## 🎯 Task Summary

### Overall Progress
- **Total Tasks**: ${tasksSummary.stats?.total || 0}
- **Completed**: ${tasksSummary.stats?.completed || 0} (${tasksSummary.stats?.completionPercentage || 0}%)
- **In Progress**: ${tasksSummary.stats?.inProgress || 0}
- **Pending**: ${tasksSummary.stats?.pending || 0}

### Subtasks Progress
- **Total Subtasks**: ${tasksSummary.stats?.subtasks?.total || 0}
- **Completed Subtasks**: ${tasksSummary.stats?.subtasks?.completed || 0} (${tasksSummary.stats?.subtasks?.completionPercentage || 0}%)
- **Pending Subtasks**: ${tasksSummary.stats?.subtasks?.pending || 0}

### Task Details
${
  tasksSummary.taskDetails
    ?.map(
      (task) =>
        `- **Task ${task.id}**: ${task.title}
  - Status: ${task.status}
  - Priority: ${task.priority}
  - Subtasks: ${task.completedSubtasks}/${task.subtasksCount} completed
  - Complexity: ${task.complexityScore}`
    )
    .join('\n') || 'No tasks found'
}

## 🔍 Quality Metrics

### Linting
- **Status**: ${qualityMetrics.linting?.success ? '✅ Passed' : '❌ Failed'}
${qualityMetrics.linting?.error ? `- **Error**: ${qualityMetrics.linting.error}` : ''}

### Type Checking
- **Status**: ${qualityMetrics.typeCheck?.success ? '✅ Passed' : '❌ Failed'}
${qualityMetrics.typeCheck?.error ? `- **Error**: ${qualityMetrics.typeCheck.error}` : ''}

### Code Formatting
- **Status**: ${qualityMetrics.formatting?.success ? '✅ Passed' : '❌ Failed'}
${qualityMetrics.formatting?.error ? `- **Error**: ${qualityMetrics.formatting.error}` : ''}

### Build Process
- **Status**: ${qualityMetrics.build?.success ? '✅ Passed' : '❌ Failed'}
${qualityMetrics.build?.error ? `- **Error**: ${qualityMetrics.build.error}` : ''}

## 🧪 Test Coverage

### Unit Tests
- **Status**: ${testCoverage.unit?.success ? '✅ Passed' : '❌ Failed'}
${
  testCoverage.coverageData?.total
    ? `- **Line Coverage**: ${testCoverage.coverageData.total.lines.pct}%
- **Function Coverage**: ${testCoverage.coverageData.total.functions.pct}%
- **Branch Coverage**: ${testCoverage.coverageData.total.branches.pct}%
- **Statement Coverage**: ${testCoverage.coverageData.total.statements.pct}%`
    : ''
}

### E2E Tests
- **Status**: ${testCoverage.e2e?.success ? '✅ Passed' : '❌ Failed'}

## 💡 Recommendations

${
  recommendations.length > 0
    ? recommendations
        .map(
          (rec) =>
            `### ${rec.type.charAt(0).toUpperCase() + rec.type.slice(1)} (${rec.priority} priority)
- **Issue**: ${rec.message}
- **Action**: ${rec.action}
${rec.tasks ? rec.tasks.map((task) => `  - ${task}`).join('\n') : ''}`
        )
        .join('\n\n')
    : 'No recommendations at this time. Great job! 🎉'
}

---

*Report generated automatically by Task Completion Reporter*
`;
  }
}

// CLI execution
const reporter = new TaskCompletionReporter();
reporter.generateReport().catch((error) => {
  console.error('Failed to generate report:', error);
  process.exit(1);
});

export default TaskCompletionReporter;
