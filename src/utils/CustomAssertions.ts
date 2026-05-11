import { Page, expect } from "@playwright/test";
import Logger from "./LoggerUtil";

export default class CustomAssertions {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  /**
   * Assert element is visible on the page
   */
  async assertElementVisible(page: Page, selector: string): Promise<void> {
    try {
      await expect(page.locator(selector)).toBeVisible();
      this.logger.info(`✓ Element visible: ${selector}`);
    } catch (error) {
      this.logger.error(`✗ Element not visible: ${selector}`);
      throw error;
    }
  }

  /**
   * Assert element is hidden on the page
   */
  async assertElementHidden(page: Page, selector: string): Promise<void> {
    try {
      await expect(page.locator(selector)).toBeHidden();
      this.logger.info(`✓ Element hidden: ${selector}`);
    } catch (error) {
      this.logger.error(`✗ Element is visible: ${selector}`);
      throw error;
    }
  }

  /**
   * Assert element is enabled
   */
  async assertElementEnabled(page: Page, selector: string): Promise<void> {
    try {
      await expect(page.locator(selector)).toBeEnabled();
      this.logger.info(`✓ Element enabled: ${selector}`);
    } catch (error) {
      this.logger.error(`✗ Element is disabled: ${selector}`);
      throw error;
    }
  }

  /**
   * Assert element is disabled
   */
  async assertElementDisabled(page: Page, selector: string): Promise<void> {
    try {
      await expect(page.locator(selector)).toBeDisabled();
      this.logger.info(`✓ Element disabled: ${selector}`);
    } catch (error) {
      this.logger.error(`✗ Element is enabled: ${selector}`);
      throw error;
    }
  }

  /**
   * Assert element contains text
   */
  async assertElementContainsText(
    page: Page,
    selector: string,
    text: string,
  ): Promise<void> {
    try {
      await expect(page.locator(selector)).toContainText(text);
      this.logger.info(`✓ Element contains text "${text}": ${selector}`);
    } catch (error) {
      this.logger.error(
        `✗ Element does not contain text "${text}": ${selector}`,
      );
      throw error;
    }
  }

  /**
   * Assert element has exact text
   */
  async assertElementHasText(
    page: Page,
    selector: string,
    text: string,
  ): Promise<void> {
    try {
      await expect(page.locator(selector)).toHaveText(text);
      this.logger.info(`✓ Element has text "${text}": ${selector}`);
    } catch (error) {
      this.logger.error(`✗ Element does not have text "${text}": ${selector}`);
      throw error;
    }
  }

  /**
   * Assert page URL matches
   */
  async assertPageUrl(page: Page, expectedUrl: string): Promise<void> {
    try {
      await expect(page).toHaveURL(expectedUrl);
      this.logger.info(`✓ Page URL is: ${expectedUrl}`);
    } catch (error) {
      this.logger.error(`✗ Page URL does not match: ${expectedUrl}`);
      throw error;
    }
  }

  /**
   * Assert page URL contains
   */
  async assertPageUrlContains(page: Page, urlPart: string): Promise<void> {
    try {
      await expect(page).toHaveURL(new RegExp(urlPart));
      this.logger.info(`✓ Page URL contains: ${urlPart}`);
    } catch (error) {
      this.logger.error(`✗ Page URL does not contain: ${urlPart}`);
      throw error;
    }
  }

  /**
   * Assert page title
   */
  async assertPageTitle(page: Page, expectedTitle: string): Promise<void> {
    try {
      await expect(page).toHaveTitle(expectedTitle);
      this.logger.info(`✓ Page title is: ${expectedTitle}`);
    } catch (error) {
      this.logger.error(`✗ Page title does not match: ${expectedTitle}`);
      throw error;
    }
  }

  /**
   * Assert element count
   */
  async assertElementCount(
    page: Page,
    selector: string,
    expectedCount: number,
  ): Promise<void> {
    try {
      await expect(page.locator(selector)).toHaveCount(expectedCount);
      this.logger.info(
        `✓ Found ${expectedCount} elements matching: ${selector}`,
      );
    } catch (error) {
      this.logger.error(`✗ Element count mismatch for selector: ${selector}`);
      throw error;
    }
  }

  /**
   * Assert element attribute value
   */
  async assertElementAttribute(
    page: Page,
    selector: string,
    attribute: string,
    expectedValue: string,
  ): Promise<void> {
    try {
      await expect(page.locator(selector)).toHaveAttribute(
        attribute,
        expectedValue,
      );
      this.logger.info(
        `✓ Element ${attribute} = ${expectedValue}: ${selector}`,
      );
    } catch (error) {
      this.logger.error(
        `✗ Element attribute mismatch - ${attribute}: ${selector}`,
      );
      throw error;
    }
  }

  /**
   * Assert element class
   */
  async assertElementClass(
    page: Page,
    selector: string,
    className: string,
  ): Promise<void> {
    try {
      await expect(page.locator(selector)).toHaveClass(
        new RegExp(`\\b${className}\\b`),
      );
      this.logger.info(`✓ Element has class "${className}": ${selector}`);
    } catch (error) {
      this.logger.error(
        `✗ Element does not have class "${className}": ${selector}`,
      );
      throw error;
    }
  }

  /**
   * Assert element value
   */
  async assertElementValue(
    page: Page,
    selector: string,
    expectedValue: string,
  ): Promise<void> {
    try {
      await expect(page.locator(selector)).toHaveValue(expectedValue);
      this.logger.info(`✓ Element value is: ${expectedValue}`);
    } catch (error) {
      this.logger.error(`✗ Element value is not: ${expectedValue}`);
      throw error;
    }
  }

  /**
   * Assert condition is true
   */
  async assertTrue(condition: boolean, message: string): Promise<void> {
    try {
      expect(condition).toBeTruthy();
      this.logger.info(`✓ ${message}`);
    } catch (error) {
      this.logger.error(`✗ ${message}`);
      throw error;
    }
  }

  /**
   * Assert condition is false
   */
  async assertFalse(condition: boolean, message: string): Promise<void> {
    try {
      expect(condition).toBeFalsy();
      this.logger.info(`✓ ${message}`);
    } catch (error) {
      this.logger.error(`✗ ${message}`);
      throw error;
    }
  }

  /**
   * Assert values are equal
   */
  async assertEqual(
    actual: any,
    expected: any,
    message: string,
  ): Promise<void> {
    try {
      expect(actual).toEqual(expected);
      this.logger.info(`✓ ${message} (${actual} = ${expected})`);
    } catch (error) {
      this.logger.error(`✗ ${message} (${actual} ≠ ${expected})`);
      throw error;
    }
  }
}
