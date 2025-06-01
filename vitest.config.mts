import { defineConfig } from 'vitest/config';
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    silent:false,
    reporters: 'verbose',
    alias: {
      '@worm_sdk': path.resolve(__dirname, 'packages/sdk'),
      '@worm_utils': path.resolve(__dirname, 'packages/utils'),
    },
    include: [
      'test/**/*.{test,spec}.{js,ts}',
      '**/*.{test,spec}.{js,ts}',
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