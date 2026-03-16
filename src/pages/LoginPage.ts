import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // TODO: Cập nhật selectors phù hợp với ứng dụng PIM của bạn
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    // TODO: Thay đổi selectors bên dưới cho đúng với app
    this.usernameInput = page.locator('[name="username"], [id="username"], input[type="text"]').first();
    this.passwordInput = page.locator('[name="password"], [id="password"], input[type="password"]').first();
    this.loginButton = page.locator('button[type="submit"], [id="login-btn"], text=Login').first();
    this.errorMessage = page.locator('.error-message, .alert-danger, [role="alert"]').first();
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.waitForPageLoad();
  }

  async loginWithEnvCredentials() {
    const username = process.env.USERNAME || '';
    const password = process.env.PASSWORD || '';
    await this.login(username, password);
  }

  async expectLoginSuccess() {
    // TODO: Cập nhật assertion phù hợp sau khi login thành công
    await expect(this.page).not.toHaveURL(/.*login.*/);
  }

  async expectLoginFailure() {
    await expect(this.errorMessage).toBeVisible();
  }
}
