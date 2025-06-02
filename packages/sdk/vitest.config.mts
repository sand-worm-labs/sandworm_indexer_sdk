import { defineConfig } from 'vitest/config';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins:[tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: [
      '__tests__/*.{test,spec}.{js,ts}',
      '**/*.{test,spec}.{js,ts}',
    ],
    exclude: [
      'node_modules',
      'dist',
      'docs',
      'coverage',
    ],

    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: 'coverage',

      include: [
        'packages/**/*.{js,ts}',
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
        'packages/**/test/**/*',
      ],

      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
});
