import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";
import Logger from "../utils/LoggerUtil";
import PageUtil from "../utils/PageUtil";
import ElementActionsUtil from "../utils/ElementActionUtil";

export default class HomePage extends BasePage {
  private readonly appLauncherButton = "button[title='App Launcher']";

  constructor(
    page: Page,
    logger: Logger,
    pageUtil: PageUtil,
    elementActions: ElementActionsUtil,
  ) {
    super(page, logger, pageUtil, elementActions);
  }
}
