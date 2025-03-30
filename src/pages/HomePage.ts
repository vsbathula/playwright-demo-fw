import { Page, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export default class HomePage extends BasePage {
    private readonly appLauncherButton = "button[title='App Launcher']";

    constructor(page: Page) {
        super(page);
    }

}