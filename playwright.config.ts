import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';

// Load environment variables from repository root .env only.
dotenv.config({ path: './.env' });

const resolvedBaseUrl = (process.env.baseURL || process.env.UAT_URL || process.env.API_URL || 'http://localhost:3000').replace(/\/+$/, '');
const useTestDataSetup = process.env.USE_TEST_DATA_SETUP === 'true';
const isUiMode = process.argv.includes('--ui');
const enableTestDataSetup = useTestDataSetup && !isUiMode;

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1, // Run tests in parallel across 1 workers locally

  // Test timeout
  timeout: parseInt(process.env.TEST_TIMEOUT || '60000'),

  // Reporting
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/test-results.json' }],
    ['junit', { outputFile: 'test-results/junit-report.xml' }],
    ['list'],
  ],

  use: {
    baseURL: resolvedBaseUrl,

    // Capture trace on first retry
    trace: 'on-first-retry',

    // Screenshot for all tests (passed and failed)
    screenshot: 'on',

    // Video on failure
    video: 'retain-on-failure',

    // Browser context options
    viewport: { width: 1920, height: 1080 },

    // Action timeout
    actionTimeout: 15000,

    // Navigation timeout
    navigationTimeout: 30000,
  },

  projects: [
    // Keep auth-setup project for non-UI runs only.
    ...(
      isUiMode
        ? []
        : [
            {
              name: 'auth-setup',
              testMatch: /.*auth\.setup\.ts/,
              timeout: 180_000,
              use: {
                headless: false,
              },
            },
          ]
    ),

    // Test data setup — optional, creates Epic + Project via browser.
    // Enable with USE_TEST_DATA_SETUP=true.
    ...(
      enableTestDataSetup
        ? [
            {
              name: 'setup',
              testMatch: /.*global\.setup\.ts/,
              dependencies: ['auth-setup'],
              use: {
                storageState: './playwright/.auth/state.json',
              },
            },
          ]
        : []
    ),

    // Main test project: always executes spec files from e2e/tests.
    {
      name: 'chromium',
      dependencies: isUiMode ? [] : (enableTestDataSetup ? ['setup'] : ['auth-setup']),
      testMatch: /.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        headless: process.env.HEADLESS === 'true',
        storageState: './playwright/.auth/state.json',
      },
    },

    // Commented out for now - focusing on Chromium for parallel execution
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     headless: process.env.HEADLESS === 'true',
    //     storageState: './playwright/.auth/state.json',
    //   },
    // },

    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     headless: process.env.HEADLESS === 'true',
    //     storageState: './playwright/.auth/state.json',
    //   },
    // },

    // // Mobile viewports
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //     storageState: './playwright/.auth/state.json',
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //     storageState: './playwright/.auth/state.json',
    //   },
    // },
  ],

  // Note: Start dev server manually with 'npm run dev' in datavaerese_frontend_&_backend folder
  // Or uncomment below to auto-start (may have issues with folder name containing &)
  // webServer: {
  //   command: 'npm run dev',
  //   cwd: './datavaerese_frontend_&_backend',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },
});
