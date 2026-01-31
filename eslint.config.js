import eslintConfigPrettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';

/** @type {import('eslint').Linter.FlatConfig[]} */
export const config = [
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/coverage/**',
            '**/.turbo/**'
        ]
    },

    // Base JS
    js.configs.recommended,

    // TypeScript
    ...tseslint.configs.recommendedTypeChecked.map((tsConfig) => ({
        ...tsConfig,
        languageOptions: {
            ...tsConfig.languageOptions,
            parserOptions: {
                project: './tsconfig.eslint.json',
                tsconfigRootDir: process.cwd()
            }
        }
    })),

    // Prettier
    eslintConfigPrettier,

    // Plugins
    {
        plugins: {
            turbo: turboPlugin,
            prettier: prettierPlugin
        },
        rules: {
            // Monorepo / Turbo
            'turbo/no-undeclared-env-vars': 'warn',

            // Prettier
            'prettier/prettier': 'warn',

            // TypeScript
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }]
        }
    }
];
