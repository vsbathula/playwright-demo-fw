import { Page, TestInfo } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";
import Logger from "./LoggerUtil";

export default class ErrorScreenshotManager {
  private logger: Logger;
  private baseScreenshotDir: string = "test-results/screenshots";

  constructor(logger: Logger) {
    this.logger = logger;
    this.ensureDirectoryExists(this.baseScreenshotDir);
  }

  /**
   * Capture screenshot on test failure
   */
  async captureScreenshotOnFailure(
    page: Page,
    testInfo: TestInfo,
    reason: string = "test_failure",
  ): Promise<string | null> {
    if (testInfo.status === "failed" || testInfo.status === "timedOut") {
      return await this.captureScreenshot(page, testInfo, reason);
    }
    return null;
  }

  /**
   * Capture screenshot with custom name
   */
  async captureScreenshot(
    page: Page,
    testInfo: TestInfo,
    screenshotName: string = "screenshot",
  ): Promise<string> {
    try {
      const testName = testInfo.title
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const screenshotDir = path.join(this.baseScreenshotDir, testName);

      this.ensureDirectoryExists(screenshotDir);

      const screenshotPath = path.join(
        screenshotDir,
        `${screenshotName}_${timestamp}.png`,
      );

      await page.screenshot({ path: screenshotPath });
      this.logger.info(`✓ Screenshot captured: ${screenshotPath}`);

      return screenshotPath;
    } catch (error) {
      this.logger.error(`✗ Failed to capture screenshot: ${error}`);
      throw error;
    }
  }

  /**
   * Capture page HTML on failure
   */
  async capturePageHtml(page: Page, testInfo: TestInfo): Promise<string> {
    try {
      const testName = testInfo.title
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "");
      const htmlDir = path.join(this.baseScreenshotDir, testName, "html");

      this.ensureDirectoryExists(htmlDir);

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const htmlPath = path.join(htmlDir, `page_${timestamp}.html`);

      const content = await page.content();
      fs.writeFileSync(htmlPath, content, "utf-8");

      this.logger.info(`✓ HTML captured: ${htmlPath}`);
      return htmlPath;
    } catch (error) {
      this.logger.error(`✗ Failed to capture HTML: ${error}`);
      throw error;
    }
  }

  /**
   * Capture browser console logs
   */
  async captureConsoleLogs(page: Page, testInfo: TestInfo): Promise<string> {
    try {
      const testName = testInfo.title
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "");
      const logsDir = path.join(this.baseScreenshotDir, testName, "logs");

      this.ensureDirectoryExists(logsDir);

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const logsPath = path.join(logsDir, `console_${timestamp}.log`);

      const logs: string[] = [];
      page.on("console", (msg) => {
        logs.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
      });

      fs.writeFileSync(logsPath, logs.join("\n"), "utf-8");
      this.logger.info(`✓ Console logs captured: ${logsPath}`);

      return logsPath;
    } catch (error) {
      this.logger.error(`✗ Failed to capture console logs: ${error}`);
      throw error;
    }
  }

  /**
   * Capture full page screenshot (scrollable)
   */
  async captureFullPageScreenshot(
    page: Page,
    testInfo: TestInfo,
    screenshotName: string = "full_page",
  ): Promise<string> {
    try {
      const testName = testInfo.title
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "");
      const screenshotDir = path.join(this.baseScreenshotDir, testName);

      this.ensureDirectoryExists(screenshotDir);

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const screenshotPath = path.join(
        screenshotDir,
        `${screenshotName}_full_${timestamp}.png`,
      );

      await page.screenshot({ path: screenshotPath, fullPage: true });
      this.logger.info(`✓ Full-page screenshot captured: ${screenshotPath}`);

      return screenshotPath;
    } catch (error) {
      this.logger.error(`✗ Failed to capture full-page screenshot: ${error}`);
      throw error;
    }
  }

  /**
   * Capture locator-specific screenshot
   */
  async captureElementScreenshot(
    page: Page,
    selector: string,
    testInfo: TestInfo,
    elementName: string = "element",
  ): Promise<string> {
    try {
      const testName = testInfo.title
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^\w-]/g, "");
      const screenshotDir = path.join(this.baseScreenshotDir, testName);

      this.ensureDirectoryExists(screenshotDir);

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const screenshotPath = path.join(
        screenshotDir,
        `${elementName}_${timestamp}.png`,
      );

      const locator = page.locator(selector);
      await locator.screenshot({ path: screenshotPath });

      this.logger.info(`✓ Element screenshot captured: ${screenshotPath}`);

      return screenshotPath;
    } catch (error) {
      this.logger.error(`✗ Failed to capture element screenshot: ${error}`);
      throw error;
    }
  }

  /**
   * Clean old screenshots (older than specified days)
   */
  cleanOldScreenshots(daysToKeep: number = 7): void {
    try {
      const now = Date.now();
      const cutoffTime = now - daysToKeep * 24 * 60 * 60 * 1000;

      const walkDir = (dir: string) => {
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir);
        files.forEach((file) => {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            walkDir(filePath);
          } else if (stat.isFile() && stat.mtimeMs < cutoffTime) {
            fs.unlinkSync(filePath);
            this.logger.info(`✓ Deleted old screenshot: ${filePath}`);
          }
        });
      };

      walkDir(this.baseScreenshotDir);
    } catch (error) {
      this.logger.error(`✗ Failed to clean old screenshots: ${error}`);
    }
  }

  /**
   * Generate screenshot summary
   */
  generateScreenshotSummary(): void {
    try {
      const summary: Record<string, string[]> = {};

      const walkDir = (dir: string, relative: string = "") => {
        if (!fs.existsSync(dir)) return;

        const files = fs.readdirSync(dir);
        files.forEach((file) => {
          const filePath = path.join(dir, file);
          const relativePath = path.join(relative, file);
          const stat = fs.statSync(filePath);

          if (stat.isDirectory()) {
            walkDir(filePath, relativePath);
          } else if (file.endsWith(".png")) {
            const testName = relative.split(path.sep)[0] || "unknown";
            if (!summary[testName]) {
              summary[testName] = [];
            }
            summary[testName].push(relativePath);
          }
        });
      };

      walkDir(this.baseScreenshotDir);

      this.logger.info("📸 Screenshot Summary:");
      Object.entries(summary).forEach(([testName, screenshots]) => {
        this.logger.info(`  ${testName}: ${screenshots.length} screenshots`);
      });
    } catch (error) {
      this.logger.error(`✗ Failed to generate summary: ${error}`);
    }
  }

  /**
   * Ensure directory exists
   */
  private ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}
