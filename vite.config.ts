import {defineConfig} from 'vite-plus';

export default defineConfig({
  lint: {
    ignorePatterns: ['**/dist/**', '**/node_modules/**'],
    plugins: ['typescript'],
    rules: {
      'typescript/consistent-type-imports': 'error',
      'no-unused-vars': 'warn',
      'no-empty': ['error', {allowEmptyCatch: true}],
      'typescript/triple-slash-reference': 'off',
    },
  },
  fmt: {
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    semi: true,
    singleQuote: true,
    quoteProps: 'as-needed',
    trailingComma: 'es5',
    bracketSpacing: false,
    arrowParens: 'always',
    ignorePatterns: ['dist/**', 'node_modules/**', 'pnpm-lock.yaml'],
  },
});
