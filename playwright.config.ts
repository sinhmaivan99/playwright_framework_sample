import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const testEnv = process.env.TEST_ENV || 'dev';

dotenv.config({ path: `.env.${testEnv}`, override: true });

const defaultBaseUrls: Record<string, string> = {
  dev: 'https://www.saucedemo.com',
  staging: 'https://www.saucedemo.com',
  prod: 'https://www.saucedemo.com',
};

const baseURL = process.env.BASE_URL || defaultBaseUrls[testEnv];

if (!baseURL) {
  throw new Error(
    `Unsupported TEST_ENV "${testEnv}". Set BASE_URL or add the environment to playwright.config.ts.`,
  );
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : 4,
  use: {
    baseURL,
    headless: process.env.HEADLESS !== 'false',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
  ],
  retries: process.env.CI ? 2 : 1,
  timeout: 30000,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
