import { test as base } from "@playwright/test";
import { environmentManager } from "../utils/EnvironmentManager";
import { testDataManager } from "../utils/TestDataManager";
import Logger from "../utils/LoggerUtil";
import ElementActionsUtil from "../utils/ElementActionUtil";
import PageUtil from "../utils/PageUtil";
import CustomAssertions from "../utils/CustomAssertions";
import ErrorScreenshotManager from "../utils/ErrorScreenshotManager";
import TestHooks from "../utils/TestHooks";
import APIClient from "../utils/APIClient";
import { EnvironmentConfig } from "../types";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";

export type TestFixtures = {
  environmentManager: typeof environmentManager;
  testDataManager: typeof testDataManager;
  logger: Logger;
  config: EnvironmentConfig;
  elementActions: ElementActionsUtil;
  pagetil: PageUtil;
  loginPage: LoginPage;
  homePage: HomePage;
  customAssertions: CustomAssertions;
  errorScreenshots: ErrorScreenshotManager;
  testHooks: TestHooks;
  apiClient: APIClient;
  testData: {
    get: (key: string) => any;
    getForEnvironment: (env: string, key: string) => any;
    getCurrentEnvironment: () => string;
  };
};

export const test = base.extend<TestFixtures>({
  environmentManager: async ({}, use) => {
    const env = process.env.NODE_ENV || "dev";
    environmentManager.initialize(env);
    await use(environmentManager);
  },

  testDataManager: async ({}, use) => {
    await use(testDataManager);
  },

  logger: async ({}, use) => {
    const logger = new Logger();
    await use(logger);
  },

  config: async ({ environmentManager }, use) => {
    const env = process.env.NODE_ENV || "dev";
    const config = environmentManager.initialize(env);
    await use(config);
  },

  elementActions: async ({ page, logger }, use) => {
    const elementActions = new ElementActionsUtil(page, logger);
    await use(elementActions);
  },

  pagetil: async ({ page, logger }, use) => {
    const pagetil = new PageUtil(page, logger);
    await use(pagetil);
  },

  testData: async ({ testDataManager }, use) => {
    const currentEnv = process.env.NODE_ENV || "dev";
    const testDataHelper = {
      get: (key: string) => testDataManager.getData(key),
      getForEnvironment: (env: string, key: string) =>
        testDataManager.getTestData(env, key),
      getCurrentEnvironment: () => currentEnv,
    };
    await use(testDataHelper);
  },

  loginPage: async ({ page, logger, pagetil, elementActions }, use) => {
    await use(new LoginPage(page, logger, pagetil, elementActions));
  },

  homePage: async ({ page, logger, pagetil, elementActions }, use) => {
    await use(new HomePage(page, logger, pagetil, elementActions));
  },

  customAssertions: async ({ logger }, use) => {
    const assertions = new CustomAssertions(logger);
    await use(assertions);
  },

  errorScreenshots: async ({ logger }, use) => {
    const screenshotManager = new ErrorScreenshotManager(logger);
    await use(screenshotManager);
  },

  testHooks: async ({ logger }, use) => {
    const hooks = new TestHooks(logger);
    await use(hooks);
  },

  apiClient: async ({ request, logger, config }, use) => {
    const apiClient = new APIClient(request, logger, config.BASE_URL || "");
    await use(apiClient);
  },
});

test.beforeEach(async ({ page, logger, testHooks }, testInfo) => {
  testInfo.annotations.push({
    type: "Start time",
    description: new Date().toISOString(),
  });
  logger.info(`Started execution of: ${testInfo.title}`);
  await testHooks.onTestStart(testInfo);
  await page.goto("/");
});

test.afterEach(
  async ({ page, logger, errorScreenshots, testHooks }, testInfo) => {
    testInfo.annotations.push({
      type: "End time",
      description: new Date().toISOString(),
    });
    logger.info(`Ending execution of: ${testInfo.title}`);
    logger.info(`${testInfo.title} status: ${testInfo.status}`);

    // Capture screenshot on failure
    if (testInfo.status === "failed") {
      try {
        await errorScreenshots.captureScreenshotOnFailure(
          page,
          testInfo,
          "failure",
        );
      } catch (error) {
        logger.error(`Failed to capture screenshot: ${error}`);
      }
    }

    // Trigger appropriate test hooks
    if (testInfo.status === "passed") {
      await testHooks.onTestPass(testInfo);
    } else if (testInfo.status === "failed") {
      await testHooks.onTestFail(testInfo);
    } else if (testInfo.status === "skipped") {
      await testHooks.onTestSkip(testInfo);
    }

    await testHooks.onTestEnd(testInfo);
  },
);

export { expect } from "@playwright/test";
