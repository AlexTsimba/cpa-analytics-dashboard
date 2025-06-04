import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': new URL('./src/', import.meta.url).pathname,
    },
  },
  test: {
    // Test environment configuration
    environment: 'happy-dom',

    // Global test configuration
    globals: true,

    // Setup files - enhanced with new helpers
    setupFiles: ['./tests/setup.ts'],

    // File patterns
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,ts,jsx,tsx}',
    ],
    exclude: ['node_modules', 'dist', '.next', 'coverage', '**/*.d.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/*.spec.{js,ts,jsx,tsx}',
        'src/types/',
        '.next/',
        'dist/',
        'coverage/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
      skipFull: false,
      all: true,
    },

    // Performance optimizations (conservative settings)
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 1, // Single thread to avoid worker issues
        useAtomics: false, // Disable atomics to avoid issues
      },
    },

    // Optimized test execution configuration
    testTimeout: 5000, // Reduced from 10s
    hookTimeout: 5000, // Reduced from 10s
    teardownTimeout: 2000, // Reduced from 5s

    // UI and reporting
    ui: true,
    open: false,
    reporters: ['verbose', 'json', 'html'],
    outputFile: {
      json: './test-results.json',
      html: './test-report.html',
    },

    // Watch configuration
    watch: false,

    // Retry configuration for flaky tests
    retry: process.env['CI'] ? 2 : 0,

    // Enhanced logging
    logHeapUsage: true,
    silent: false,

    // Enhanced TypeScript configuration
    typecheck: {
      enabled: false, // Disable during test runs for performance
    },
  },
});
