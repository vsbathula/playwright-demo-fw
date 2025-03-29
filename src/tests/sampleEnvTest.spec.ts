import { test } from "@playwright/test";
import LoginPage from "../pages/LoginPage";

test("test login", async({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.userLogin(process.env.username!, process.env.password!);
});