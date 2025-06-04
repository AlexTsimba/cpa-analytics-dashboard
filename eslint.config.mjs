// @ts-check
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  // Base ESLint recommended rules
  eslint.configs.recommended,
  
  // Next.js configuration using compat for now
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  
  // TypeScript ESLint configuration
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // Enhanced TypeScript configuration
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Enhanced TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn', // Relaxed to warn
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'], // Relaxed to warn
      '@typescript-eslint/array-type': ['error', { default: 'array' }],
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'warn', // Relaxed to warn

      // General code quality rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-expressions': 'error',
      'prefer-template': 'warn', // Relaxed to warn
      'object-shorthand': 'error',
      'no-nested-ternary': 'warn', // Relaxed to warn
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'curly': ['error', 'all'],

      // React/Next.js specific enhancements
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', 'never'],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-useless-fragment': 'error',
      'react/self-closing-comp': 'error',
      'react/prefer-stateless-function': 'error',
      'react/function-component-definition': [
        'warn', // Relaxed to warn for legacy components
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],

      // Import organization
      'sort-imports': [
        'warn', // Relaxed to warn
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
    },
  },

  // Test files configuration
  {
    files: [
      '**/__tests__/**/*',
      '**/*.{test,spec}.{js,jsx,ts,tsx}',
      '**/tests/**/*',
      '**/e2e/**/*',
    ],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },

  // JavaScript files (disable type-aware rules)
  {
    files: ['**/*.js', '**/*.jsx'],
    ...tseslint.configs.disableTypeChecked,
  },

  // Prettier integration (must be last to override conflicting rules)
  prettierConfig,

  // Global ignores
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.nyc_output/**',
      '*.config.{js,ts,mjs}',
      'next-env.d.ts',
      'tasks/**',
      'scripts/**',
      '.git/**',
      'docs/**',
      '.taskmaster/**',
      '.roo/**',
      '.cursor/**',
      'playwright-report/**',
      'playwright-results/**',
      'assets/**',
      '.tsbuildinfo',
      'tsconfig.tsbuildinfo',
    ],
  },
);
