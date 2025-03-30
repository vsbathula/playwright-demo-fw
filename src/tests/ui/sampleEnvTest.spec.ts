import { HOME_PAGE_TITLE, LOGIN_PAGE_TITLE } from "../../data/constants";
import { test } from "../../fixtures/base_fixture";

// test.describe.configure({
//     mode: "parallel"
// });

test("login test", async({ logger, loginPage, homePage }, testInfo) => {
    await loginPage.validatePageTitle(LOGIN_PAGE_TITLE);
    await loginPage.userLogin(process.env.username!, process.env.password!);
    await homePage.validatePageTitle((HOME_PAGE_TITLE), 10000);
});