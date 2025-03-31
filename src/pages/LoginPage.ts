import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export default class LoginPage extends BasePage {
  private readonly usernameInput = "#username";
  private readonly passwordInput = "#password";
  private readonly loginButton = "#Login";

  constructor(page: Page) {
    super(page);
  }

  async fillUsername(username: string) {
    await this.page.fill(this.usernameInput, username);
    this.logger.info(`Entered username: ${username}`)
  }

  async fillPassword(password: string) {
    await this.page.fill(this.passwordInput, password);
    this.logger.info(`Entered username: ${password}`)
  }

  async clickLoginButton() {
    await this.page
      .click(this.loginButton)
      .catch((error) => {
        this.logger.error(`Error clicking login button: ${error}`);
        throw error;
      })
      .then(() => {
        this.logger.info(`Login button clicked.`);
    });
  }

  async userLogin(username: string, password: string) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLoginButton();
  }
}
