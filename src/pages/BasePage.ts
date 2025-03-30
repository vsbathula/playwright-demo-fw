import { Page, expect } from '@playwright/test';
import Logger from "../utils/LoggerUtil";
import { DEFAULT_TIMEOUT } from '../data/constants';

export class BasePage {
  page: Page;
  logger = new Logger();

  constructor(page: Page) {
    this.page = page;
  }

  async navigateToPage(url: string) {
    await this.page.goto(url);
    this.logger.info(`Navigated to url: ${process.env.baseurl}${url}`);
  }

  async validatePageTitle(expectedTitle: string, timeoutInMilliSec: number = DEFAULT_TIMEOUT): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle, { timeout: timeoutInMilliSec});
    this.logger.info(`Page title: ${expectedTitle}`);
  }
}
