import { test as base} from "@playwright/test";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import Logger from "../utils/LoggerUtil";

const loggerObject = new Logger();

base.beforeEach(async ({}, testInfo) => {
    loggerObject.info(`Started exceution of: ${testInfo.title}`);
});

base.afterEach(async ({}, testInfo) => {
    loggerObject.info(`Ending exceution of: ${testInfo.title}`);
    loggerObject.info(`${testInfo.title} status: ${testInfo.status}`);
});

type PageInit = {
    loginPage: LoginPage,
    homePage: HomePage,
    logger: Logger
}

export const test = base.extend<PageInit>({
    logger: loggerObject,
    loginPage: async({ page }, use) => {
        await use(new LoginPage(page));
    },
    homePage: async({ page }, use) => {
        await use(new HomePage(page));
    }
});