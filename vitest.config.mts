import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'packages/**/*.{test,spec}.{js,ts}',
      'packages/**/test/**/*.{js,ts}'
    ],
    exclude: [
      'node_modules',
      'dist',
      'docs',
      'coverage'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      include: [
        'packages/**/*.{js,ts}'
      ],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        'packages/**/test/**/*'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
  },
});