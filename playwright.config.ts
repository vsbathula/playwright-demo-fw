import ( defineConfig, devices } from '@playwright/test'; 
import ( environmentManager ) from "./src/utils/EnvironmentManager';

// Initialize environment configuration
// Default to "int' if no NODE_ENV is set
const environment = process.env.NODE_ENV || 'qa';
const config = environmentManager.initialize(environment);

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export default defineConfig({
    testDir: ''./src/tests',
    /* Run tests in files in parallel */
    fullyParallel: config.PARALLEL_EXECUTION ?? true,
    /* Fail the build on CI if you accidentally left test. only in the source code. */ 
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : (config.RETRIES || 0), 
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : (config.MAX_WORKERS || undefined) 
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: "html',
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like 'await page.goto(**)'. */ 
        baseURL: config.BASE_URL,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */ 
        trace: config.ENABLE_TRACING ? 'on' : 'on-first-retry', 
        screenshot: config.ENABLE_SCREENSHOTS ? 'on' : 'only-on-failure', 
        video: config.ENABLE_VIDEO ? {
            mode: 'on',
            size: { width: config.VIEWPORT_WIDTH || 1280, height: config.VIEWPORT_HEIGHT || 720 }
        }: 'off',
        viewport: config.VIEWPORT_WIDTH && config.VIEWPORT_HEIGHT ? { 
            width: config.VIEWPORT_WIDTH, 
            height: config.VIEWPORT_HEIGHT
        }: null,
        launchOptions: { 
            headless: config.HEADLESS, 
            slowMo: config.SLOW_MOTION || 0,
            args: ["--start-maximized"]
        }
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'ui',
            testDir: './src/tests/ui', // Only run tests in the 'tests/ui' directory 
            use: {
                ...devices['Desktop Chrome'], // Use specified browser settings 
                baseURL: config.BASE_URL,
            },
        },

        // --- API Testing Project ---
        {
            name: 'api',
            testDir: './tests/api', // Only run tests in the 'tests/api' directory
            use: {
                // Playwright's built-in request fixture does not require browser binaries
                // Set specific baseURL and headers for API calls
                baseURL:'https://ap1.yourapplication.com',
                // extraHTTPHeaders: {
                    // 'Accept': 'application/json',
                    // 'Authorization': `Bearer ${process.env.API_TOKEN}`, 
                //},
            }
        }
    ],

});
