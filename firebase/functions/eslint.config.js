// @ts-check

const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const globals = require('globals');

module.exports = tseslint.config(
  // ESLintの推奨設定
  eslint.configs.recommended,
  
  // TypeScript推奨設定
  ...tseslint.configs.recommendedTypeChecked,
  
  // グローバル設定
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },
  
  // TypeScriptファイル用のルール
  {
    files: ['**/*.ts'],
    rules: {
      // 警告レベルのルール
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      
      // 無効化するルール（Firebase Functionsでよく使うパターン）
      'no-console': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
  
  // JavaScriptファイル用の設定
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
  
  // 無視するファイル
  {
    ignores: [
      'lib/**/*',
      'node_modules/**/*',
      '*.config.js',
    ],
  }
