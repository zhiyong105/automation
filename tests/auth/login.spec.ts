import { test, expect } from '../../src/fixtures/auth.fixture';

// TODO: Cập nhật các test cases phù hợp với ứng dụng PIM của bạn
test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-AUTH-001: Login thành công với credentials hợp lệ', async ({ loginPage }) => {
    // TODO: Cập nhật test steps
    await loginPage.loginWithEnvCredentials();
    await loginPage.expectLoginSuccess();
  });

  test('TC-AUTH-002: Login thất bại với password sai', async ({ loginPage }) => {
    // TODO: Cập nhật test steps
    await loginPage.login(process.env.USERNAME || '', 'wrong_password');
    await loginPage.expectLoginFailure();
  });

  test('TC-AUTH-003: Login thất bại với username trống', async ({ loginPage }) => {
    // TODO: Cập nhật test steps
    await loginPage.login('', process.env.PASSWORD || '');
    await loginPage.expectLoginFailure();
  });
});
