/**
 * Performance Configuration and Thresholds
 *
 * Defines performance budgets, thresholds, and alerting rules
 * for CI/CD pipeline and test execution monitoring.
 */

export type PerformanceThresholds = {
  // CI/CD Pipeline Thresholds (in milliseconds)
  pipeline: {
    total_build_time: { max: number };
    dependency_install: { max: number };
    type_check: { max: number };
    lint: { max: number };
    test_unit: { max: number };
    test_e2e: { max: number };
    build: { max: number };
    deployment: { max: number };
  };

  // Memory Thresholds (in bytes)
  memory: {
    heap_used: { max: number };
    rss: { max: number };
    external: { max: number };
  };

  // Test Performance Thresholds
  tests: {
    single_test: { max: number };
    test_suite: { max: number };
    coverage_collection: { max: number };
  };

  // Frontend Performance Thresholds (Lighthouse metrics)
  frontend: {
    first_contentful_paint: { max: number };
    largest_contentful_paint: { max: number };
    time_to_interactive: { max: number };
    cumulative_layout_shift: { max: number };
    total_blocking_time: { max: number };
  };
};

export const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  pipeline: {
    total_build_time: { max: 300000 }, // 5 minutes
    dependency_install: { max: 120000 }, // 2 minutes
    type_check: { max: 30000 }, // 30 seconds
    lint: { max: 15000 }, // 15 seconds
    test_unit: { max: 60000 }, // 1 minute
    test_e2e: { max: 180000 }, // 3 minutes
    build: { max: 120000 }, // 2 minutes
    deployment: { max: 60000 }, // 1 minute
  },
  memory: {
    heap_used: { max: 536870912 }, // 512MB
    rss: { max: 1073741824 }, // 1GB
    external: { max: 268435456 }, // 256MB
  },
  tests: {
    single_test: { max: 5000 }, // 5 seconds per test
    test_suite: { max: 30000 }, // 30 seconds per suite
    coverage_collection: { max: 10000 }, // 10 seconds
  },
  frontend: {
    first_contentful_paint: { max: 2000 }, // 2 seconds
    largest_contentful_paint: { max: 2500 }, // 2.5 seconds
    time_to_interactive: { max: 3000 }, // 3 seconds
    cumulative_layout_shift: { max: 0.1 }, // CLS score
    total_blocking_time: { max: 300 }, // 300ms
  },
};
export type AlertConfig = {
  enabled: boolean;
  channels: ('console' | 'github' | 'file')[];
  thresholds: {
    regression_percent: number;
    consecutive_failures: number;
    memory_increase_percent: number;
  };
};

export const DEFAULT_ALERT_CONFIG: AlertConfig = {
  enabled: true,
  channels: ['console', 'github', 'file'],
  thresholds: {
    regression_percent: 20, // 20% increase triggers alert
    consecutive_failures: 3, // 3 consecutive failures
    memory_increase_percent: 50, // 50% memory increase
  },
};

/**
 * Environment-specific performance configurations
 */
export function getPerformanceConfig(environment: string = 'development'): {
  thresholds: PerformanceThresholds;
  alerts: AlertConfig;
} {
  switch (environment) {
    case 'production':
      return {
        thresholds: {
          ...DEFAULT_THRESHOLDS,
          pipeline: {
            ...DEFAULT_THRESHOLDS.pipeline,
            total_build_time: { max: 240000 }, // Stricter for production
            test_e2e: { max: 120000 },
          },
        },
        alerts: {
          ...DEFAULT_ALERT_CONFIG,
          thresholds: {
            ...DEFAULT_ALERT_CONFIG.thresholds,
            regression_percent: 15,
          },
        },
      };

    case 'ci':
      return {
        thresholds: DEFAULT_THRESHOLDS,
        alerts: {
          ...DEFAULT_ALERT_CONFIG,
          channels: ['console', 'github'],
          thresholds: {
            ...DEFAULT_ALERT_CONFIG.thresholds,
            consecutive_failures: 2,
          },
        },
      };

    default:
      return {
        thresholds: DEFAULT_THRESHOLDS,
        alerts: DEFAULT_ALERT_CONFIG,
      };
  }
}
