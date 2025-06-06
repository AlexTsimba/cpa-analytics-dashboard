// @ts-check
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

export default tseslint.config(
  // Base configuration
  js.configs.recommended,

  // Next.js configuration - using exact pattern from docs
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),

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
      // TypeScript rules - focused on preventing real issues
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn', // Downgraded from error
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn', // Downgraded
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'warn', // Downgraded from error
      '@typescript-eslint/consistent-type-imports': [
        'warn', // Downgraded from error
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
      '@typescript-eslint/array-type': ['warn', { default: 'array' }], // Downgraded
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'off', // Disabled - too restrictive

      // General code quality rules - practical focus
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn', // Downgraded - useful in development
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-expressions': 'warn', // Downgraded
      'prefer-template': 'warn',
      'object-shorthand': 'warn', // Downgraded
      'no-nested-ternary': 'off', // Disabled - sometimes useful
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['warn', 'all'], // Downgraded

      // React/Next.js specific - focused on common issues
      'react/jsx-boolean-value': ['warn', 'never'], // Downgraded
      'react/jsx-curly-brace-presence': ['warn', 'never'], // Downgraded
      'react/jsx-fragments': ['warn', 'syntax'], // Downgraded
      'react/jsx-no-useless-fragment': 'warn', // Downgraded
      'react/self-closing-comp': 'warn', // Downgraded
      'react/prefer-stateless-function': 'off', // Disabled - hooks make this obsolete
      'react/function-component-definition': 'off', // Disabled - too restrictive

      // Import organization - helpful but not blocking
      'sort-imports': [
        'off', // Disabled - often conflicts with auto-import tools
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],

      // New helpful rules
      'prefer-arrow-callback': 'warn',
      'no-duplicate-imports': 'error',
      'no-unreachable': 'error',
      'no-constant-condition': 'warn',
    },
  },

  // Test files configuration - minimal restrictions
  {
    files: [
      '**/__tests__/**/*',
      '**/*.{test,spec}.{js,jsx,ts,tsx}',
      '**/tests/**/*',
    ],
    rules: {
      // Disable most rules for tests - focus on functionality
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      'sort-imports': 'off',
      'react/function-component-definition': 'off',
      'react/jsx-no-useless-fragment': 'off',
      'prefer-arrow-callback': 'off',
      'no-duplicate-imports': 'off',
    },
  },

  // Development files - relaxed rules
  {
    files: [
      '**/*.config.{js,ts,mjs}',
      '**/scripts/**',
      '**/*.d.ts',
      'src/lib/database/migrate.ts', // Database migration files
    ],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'prefer-const': 'off',
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
      'e2e/**', // Ignore e2e directory completely
    ],
  }
);
