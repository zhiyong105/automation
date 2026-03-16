import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // App uses 2-step login: enter username → Sign In → enter password → Sign In
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByRole('textbox', { name: 'Username or email' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.getByText(/Invalid/i);
  }

  // Step 1 only: enter username and click Sign In (used to test username validation)
  async submitUsername(username: string) {
    await this.usernameInput.fill(username);
    await this.signInButton.click();
  }

  async login(username: string, password: string) {
    // Step 1: enter username, click Sign In
    await this.submitUsername(username);
    // Step 2: enter password, click Sign In
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await this.waitForPageLoad();
  }

  async loginWithEnvCredentials() {
    const username = process.env.USERNAME || '';
    const password = process.env.PASSWORD || '';
    await this.login(username, password);
  }

  async expectLoginSuccess() {
    await expect(this.page).toHaveURL(/.*dashboard.*/);
  }

  async expectLoginFailure() {
    await expect(this.errorMessage).toBeVisible();
  }
}
