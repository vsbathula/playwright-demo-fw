import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

if (!process.env.NODE_ENV) {
  dotenv.config({ path: `${__dirname}/src/config/.env` });
} else {
  dotenv.config({path: `${__dirname}/src/config/.env.${process.env.NODE_ENV}`});
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: process.env.baseurl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'on',
    video: {
      mode: 'off',
      size: { width: 1280, height: 720 }
    },
    viewport: null,
    launchOptions: {
      args: ["--start-maximized"]
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'Chromium', // Project for UI tests
      testDir: './src/tests/ui',
      use: { 
        baseURL: process.env.baseurl,
        headless: true,
        ...devices['Desktop Chrome'],
      }
    },
    {
      name: 'firefox', // Project for UI tests
      testDir: './src/tests/ui',
      use: { 
        baseURL: process.env.baseurl,
        headless: true,
        ...devices['Desktop Firefox']  
      }
    },
    {
      name: 'safari', // Project for UI tests
      testDir: './src/tests/ui',
      use: { 
        baseURL: process.env.baseurl,
        headless: true,
        ...devices['Desktop Safari']  
      }
    },
    {
      name: 'api', // Project for API tests
      testDir: './src/tests/api',
      use: { 
        baseURL: process.env.apiurl,
        headless: true,
        extraHTTPHeaders: {
          'Accept': 'application/json',
          'Authorization': `token ${process.env.API_TOKEN}`,
        },
        proxy: {
          server: 'http://my-proxy:8080'
        }
      },
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
