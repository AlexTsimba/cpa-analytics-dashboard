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

    // Setup files
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
      reporter: ['text', 'json', 'html'],
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
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },

    // Test execution configuration
    testTimeout: 10000,
    hookTimeout: 10000,

    // UI and reporting
    ui: true,
    open: false,

    // Watch configuration
    watch: false,
  },
});
