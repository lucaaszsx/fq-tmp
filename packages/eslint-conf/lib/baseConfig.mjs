import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from "typescript-eslint";
import js from '@eslint/js';

export const baseConfig = [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/.turbo/**'
    ]
  },
  js.configs.recommended,
  prettierConfig,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
      turbo: turboPlugin
    },
    rules: {
      'prettier/prettier': 'warn',
      'turbo/no-undeclared-env-vars': 'warn'
    }
  }
];