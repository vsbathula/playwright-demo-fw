import { Page, expect } from "@playwright/test";
import Logger from "../utils/LoggerUtil";

export default class HomePage  {
    private readonly homePageTitle = "Lightning Experience | Salesforce";
    private readonly appLauncherButton = "button[title='App Launcher']";
    private logger = new Logger();

    constructor(private page: Page) {
        
    }

    async validateHomePageTitle() {
        await expect(this.page).toHaveTitle(this.homePageTitle, { timeout: 10000 }); 
        this.logger.info(`Home page title: ${this.homePageTitle}`);
        this.logger.info(`Navigated to url: ${this.page.url()}`);
    }
}