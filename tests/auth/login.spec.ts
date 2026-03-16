import { test, expect } from '../../src/fixtures/auth.fixture';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-AUTH-001: Login successfully with valid credentials', async ({ loginPage }) => {
    await loginPage.loginWithEnvCredentials();
    await loginPage.expectLoginSuccess();
  });

  test('TC-AUTH-002: Login fails with wrong password', async ({ loginPage }) => {
    await loginPage.login(process.env.USERNAME || '', 'wrong_password');
    await loginPage.expectLoginFailure();
  });

  test('TC-AUTH-003: Login fails with empty username', async ({ loginPage }) => {
    // App validates username at step 1, does not proceed to password step
    await loginPage.submitUsername('');
    await loginPage.expectLoginFailure();
  });
});
