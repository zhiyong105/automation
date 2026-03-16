import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

type AuthFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await page.goto('/');
    await loginPage.loginWithEnvCredentials();
    await loginPage.expectLoginSuccess();
    await use(page);
  },
});

export { expect } from '@playwright/test';
