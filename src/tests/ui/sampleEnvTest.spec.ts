import { test } from "../../fixtures/base_fixture";

// test.describe.configure({
//     mode: "parallel"
// });

test("login test", async({ logger, loginPage, homePage }, testInfo) => {
    await loginPage.userLogin(process.env.username!, process.env.password!);
    await homePage.validateHomePageTitle();
});

test("login test1", async({ logger, loginPage, homePage }, testInfo) => {
    await loginPage.userLogin(process.env.username!, process.env.password!);
    await homePage.validateHomePageTitle();
});

test("login test2", async({ logger, loginPage, homePage }, testInfo) => {
    await loginPage.userLogin(process.env.username!, process.env.password!);
    await homePage.validateHomePageTitle();
});