import { TestInfo } from "@playwright/test";
import Logger from "./LoggerUtil";

export type TestHookCallback = (
  testInfo: TestInfo,
  data?: any,
) => Promise<void>;

export interface TestHookListener {
  onTestStart?: TestHookCallback;
  onTestPass?: TestHookCallback;
  onTestFail?: TestHookCallback;
  onTestSkip?: TestHookCallback;
  onTestRetry?: TestHookCallback;
  onTestEnd?: TestHookCallback;
}

export default class TestHooks {
  private logger: Logger;
  private listeners: TestHookListener[] = [];
  private testMetrics: Map<string, any> = new Map();

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Register a test listener
   */
  registerListener(listener: TestHookListener): void {
    this.listeners.push(listener);
    this.logger.info(`✓ Test listener registered`);
  }

  /**
   * Unregister a test listener
   */
  unregisterListener(listener: TestHookListener): void {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
      this.logger.info(`✓ Test listener unregistered`);
    }
  }

  /**
   * Trigger test start hooks
   */
  async onTestStart(testInfo: TestInfo): Promise<void> {
    this.testMetrics.set(testInfo.titlePath.join(" > "), {
      startTime: Date.now(),
      status: null,
    });

    this.logger.info(`▶️ Test Started: ${testInfo.title}`);

    for (const listener of this.listeners) {
      if (listener.onTestStart) {
        try {
          await listener.onTestStart(testInfo);
        } catch (error) {
          this.logger.error(`Error in onTestStart listener: ${error}`);
        }
      }
    }
  }

  /**
   * Trigger test pass hooks
   */
  async onTestPass(testInfo: TestInfo): Promise<void> {
    this.updateTestMetrics(testInfo, "PASSED");
    this.logger.info(
      `✅ Test Passed: ${testInfo.title} (${this.getTestDuration(testInfo)}ms)`,
    );

    for (const listener of this.listeners) {
      if (listener.onTestPass) {
        try {
          await listener.onTestPass(testInfo);
        } catch (error) {
          this.logger.error(`Error in onTestPass listener: ${error}`);
        }
      }
    }
  }

  /**
   * Trigger test fail hooks
   */
  async onTestFail(testInfo: TestInfo): Promise<void> {
    this.updateTestMetrics(testInfo, "FAILED");
    this.logger.error(
      `❌ Test Failed: ${testInfo.title} (${this.getTestDuration(testInfo)}ms)`,
    );
    this.logger.error(`   Error: ${testInfo.errors[0]?.message || "Unknown"}`);

    for (const listener of this.listeners) {
      if (listener.onTestFail) {
        try {
          await listener.onTestFail(testInfo);
        } catch (error) {
          this.logger.error(`Error in onTestFail listener: ${error}`);
        }
      }
    }
  }

  /**
   * Trigger test skip hooks
   */
  async onTestSkip(testInfo: TestInfo): Promise<void> {
    this.updateTestMetrics(testInfo, "SKIPPED");
    this.logger.info(`⊘ Test Skipped: ${testInfo.title}`);

    for (const listener of this.listeners) {
      if (listener.onTestSkip) {
        try {
          await listener.onTestSkip(testInfo);
        } catch (error) {
          this.logger.error(`Error in onTestSkip listener: ${error}`);
        }
      }
    }
  }

  /**
   * Trigger test retry hooks
   */
  async onTestRetry(testInfo: TestInfo): Promise<void> {
    this.logger.warn(
      `🔄 Test Retrying: ${testInfo.title} (Attempt ${testInfo.retry + 1})`,
    );

    for (const listener of this.listeners) {
      if (listener.onTestRetry) {
        try {
          await listener.onTestRetry(testInfo);
        } catch (error) {
          this.logger.error(`Error in onTestRetry listener: ${error}`);
        }
      }
    }
  }

  /**
   * Trigger test end hooks
   */
  async onTestEnd(testInfo: TestInfo): Promise<void> {
    this.logger.info(`⏹ Test Ended: ${testInfo.title}`);

    for (const listener of this.listeners) {
      if (listener.onTestEnd) {
        try {
          await listener.onTestEnd(testInfo);
        } catch (error) {
          this.logger.error(`Error in onTestEnd listener: ${error}`);
        }
      }
    }
  }

  /**
   * Get test duration in milliseconds
   */
  private getTestDuration(testInfo: TestInfo): number {
    const testKey = testInfo.titlePath.join(" > ");
    const metrics = this.testMetrics.get(testKey);
    return metrics ? Date.now() - metrics.startTime : 0;
  }

  /**
   * Update test metrics
   */
  private updateTestMetrics(testInfo: TestInfo, status: string): void {
    const testKey = testInfo.titlePath.join(" > ");
    const metrics = this.testMetrics.get(testKey) || {};
    metrics.status = status;
    metrics.duration = Date.now() - (metrics.startTime || Date.now());
    this.testMetrics.set(testKey, metrics);
  }

  /**
   * Get test metrics
   */
  getMetrics(): Map<string, any> {
    return this.testMetrics;
  }

  /**
   * Generate metrics report
   */
  generateMetricsReport(): void {
    this.logger.info("📊 Test Metrics Report:");

    let passedCount = 0;
    let failedCount = 0;
    let skippedCount = 0;
    let totalDuration = 0;

    this.testMetrics.forEach((metrics, testName) => {
      if (metrics.status === "PASSED") passedCount++;
      if (metrics.status === "FAILED") failedCount++;
      if (metrics.status === "SKIPPED") skippedCount++;
      totalDuration += metrics.duration || 0;
    });

    this.logger.info(`  ✅ Passed: ${passedCount}`);
    this.logger.info(`  ❌ Failed: ${failedCount}`);
    this.logger.info(`  ⊘ Skipped: ${skippedCount}`);
    this.logger.info(
      `  ⏱ Total Duration: ${(totalDuration / 1000).toFixed(2)}s`,
    );
  }

  /**
   * Clear metrics
   */
  clearMetrics(): void {
    this.testMetrics.clear();
  }
}
