import { Page } from "@playwright/test";
import Logger from "../utils/LoggerUtil";
import PageUtil from "../utils/PageUtil";
import ElementActionsUtil from "../utils/ElementActionUtil";
import { DEFAULT_TIMEOUT } from "../data/constants";

export class BasePage {
  page: Page;
  logger: Logger;
  pageUtil: PageUtil;
  elementActions: ElementActionsUtil;

  constructor(
    page: Page,
    logger: Logger,
    pageUtil: PageUtil,
    elementActions: ElementActionsUtil,
  ) {
    this.page = page;
    this.logger = logger;
    this.pageUtil = pageUtil;
    this.elementActions = elementActions;
  }

  async navigateToPage(url: string) {
    await this.page.goto(url);
    this.logger.info(`Navigated to url: ${process.env.BASE_URL}${url}`);
  }

  async validatePageTitle(): Promise<String> {
    try {
      await this.page.waitForLoadState();

      const pageTitle = await this.page.title();
      this.logger.info(`Page title: ${pageTitle}`);
      return pageTitle;
    } catch (error) {
      this.logger.error(`Failed to retrieve page title: ${error}`);
      throw new Error("Failed to retrieve page title");
    }
  }
}
