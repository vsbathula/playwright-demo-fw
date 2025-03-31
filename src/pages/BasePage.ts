import { Page } from '@playwright/test';
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

  async validatePageTitle(): Promise<String> {
    try {
      await this.page.waitForLoadState();

      const pageTitle = await this.page.title();
      this.logger.info(`Page title: ${pageTitle}`);
      return pageTitle;
    } catch (error) {
      this.logger.error(`Failed to retrieve page title: ${error}`);
      throw new Error('Failed to retrieve page title');
    }
  }
}
