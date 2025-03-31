import { HOME_PAGE_TITLE, LOGIN_PAGE_TITLE } from "../../data/constants";
import { test, expect } from "../../fixtures/base_fixture";

// test.describe.configure({
//     mode: "parallel"
// });

test("login test", async({ logger, loginPage, homePage }, testInfo) => {
    expect(await loginPage.validatePageTitle()).toBe(LOGIN_PAGE_TITLE);
    await loginPage.userLogin(process.env.username!, process.env.password!);
    expect(await homePage.validatePageTitle()).toBe(HOME_PAGE_TITLE);
});