import { Page, expect } from "@playwright/test";
import Logger from "../utils/LoggerUtil";

export default class LoginPage {
  private readonly usernameInput = "#username";
  private readonly passwordInput = "#password";
  private readonly loginButton = "#Login";
  private readonly loginPageTitle = "Login | Salesforce";
  private logger = new Logger();

  constructor(private page: Page) {
  }

  async navigateToLoginPage() {
    await this.page.goto("/");
    this.logger.info(`Navigated to url: ${process.env.baseurl}`);
    await expect(this.page).toHaveTitle(this.loginPageTitle);
    this.logger.info(`Login page title: ${this.loginPageTitle}`);
  }

  async fillUsername(username: string) {
    await this.page.locator(this.usernameInput).fill(username);
    this.logger.info(`Entered username: ${username}`)
  }

  async fillPassword(password: string) {
    await this.page.locator(this.passwordInput).fill(password);
    this.logger.info(`Entered username: ${password}`)
  }

  async clickLoginButton() {
    await this.page
      .locator(this.loginButton)
      .click()
      .catch((error) => {
        this.logger.error(`Error clicking login button: ${error}`);
        throw error;
      })
      .then(() => {
        this.logger.info(`Login button clicked.`);
    });
  }

  async userLogin(username: string, password: string) {
    await this.navigateToLoginPage();
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }
}
