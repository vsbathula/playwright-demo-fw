import { Page } from "@playwright/test";
import Logger from "./LoggerUtil";

export default class PageUtil {
  private page: Page;
  private logger: Logger;

  constructor(page: Page, logger: Logger) {
    this.page = page;
    this.logger = logger;
  }

  /**
   * Wait for page to become stable after potential redirects
   */
  async waitForPageStable(options?: {
    short?: boolean;
    timeout?: number;
  }): Promise<void> {
    const timeout = options?.timeout || (options?.short ? 3000 : 10000);
    try {
      // Wait for network to be idle (no requests for 500ms)
      await this.page.waitForLoadState("networkidle", { timeout });

      // Additional wait for DOM to stabilize
      await this.page.waitForLoadState("domcontentloaded", { timeout });
      this.logger.info("Page stabilized after navigation/action");
    } catch (error) {
      this.logger.error(`Error waiting for page to become stable: ${error}`);
    }
  }

  /**
   * Wait for redirect or page stability after an action
   */
  async waitforRedirectorPageStable(previousUrl: string): Promise<void> {
    try {
      // First, check if URL changed (indicating redirect)
      const urlChanged = await this.waitForUrlChange(previousUrl, 2000);
      if (urlChanged) {
        // If redirected, wait for the new page to fully load
        await this.waitForPageStable();
      } else {
        // No redirect, just ensure page is stable
        await this.waitForPageStable({ short: true });
      }
    } catch (error) {
      this.logger.error(
        `Error waiting for redirect or page stability: ${error}`,
      );

      // Fallback to basic wait
      await this.page.waitForLoadState("domcontentloaded");
    }
  }

  /**
   * Wait for url to change from previousUrl within timeout
   */
  async waitForUrlChange(
    previuosurl: string,
    timeout: number,
  ): Promise<boolean> {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
      const currentUrl = this.page.url();
      if (currentUrl !== previuosurl) {
        return true; // URL changed
      }
      await this.page.waitForTimeout(100);
    }
    return false;
  }

  /**
   * Enhanced url assertion with redirect and stability handling
   */
  async waitForUrltStable(
    expectedUrlPart: string,
    options?: { timeout?: number },
  ): Promise<void> {
    const timeout = options?.timeout || 10000;
    try {
      // Wait for URL to contain expected part, which handles both direct navigation and redirects
      await this.page.waitForURL(
        (url) => url.toString().includes(expectedUrlPart),
        { timeout },
      );

      // Ensure page is stable after navigation/redirect
      await this.waitForPageStable({ short: true });
      const currentUrl = this.page.url();
      if (!currentUrl.toLowerCase().includes(expectedUrlPart.toLowerCase())) {
        throw new Error(
          `URL does not contain expected part. Expected: ${expectedUrlPart}, Actual: ${currentUrl}`,
        );
      }
      this.logger.info(
        `URL assertion passed. Expected part: ${expectedUrlPart}, Actual URL: ${currentUrl}`,
      );
    } catch (error) {
      this.logger.error(
        `Error asserting URL. Expected: ${expectedUrlPart}, Actual: ${this.page.url()}, Error: ${error}`,
      );
      throw error;
    }
  }

  /**
   * Navigate to URL with stability handling
   */
  async navigateAndWaitForStable(url: string): Promise<void> {
    const previousUrl = this.page.url();
    await this.page.goto(url);
    await this.waitforRedirectorPageStable(previousUrl);
    this.logger.info(`Navigation completed to: ${url}`);
  }
  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Check if URL contains expected part
   */
  urlContains(expectedPart: string): boolean {
    return this.page.url().toLowerCase().includes(expectedPart.toLowerCase());
  }

  /**
   * Wait for specific URL pattern
   */
  async waitForUrlPattern(
    pattern: string | RegExp,
    options?: { timeout?: number },
  ): Promise<void> {
    const timeout = options?.timeout || 10000;
    if (typeof pattern === "string") {
      await this.page.waitForURL((url) => url.toString().includes(pattern), {
        timeout,
      });
    } else {
      await this.page.waitForURL(pattern, { timeout });
    }
    await this.waitForPageStable({ short: true });
    this.logger.info(`URL pattern matched: ${pattern}`);
  }
}
