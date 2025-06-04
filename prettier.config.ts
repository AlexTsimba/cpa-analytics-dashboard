import type { Config } from 'prettier';

const config: Config = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  quoteProps: 'as-needed',

  // TypeScript specific options
  jsxSingleQuote: true,

  // File overrides for specific file types
  overrides: [
    {
      files: '*.{md,mdx}',
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
    {
      files: '*.{yml,yaml}',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 100,
        tabWidth: 2,
      },
    },
  ],
};

export default config;
