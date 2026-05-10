import { test, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { users } from '@test-data/users';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('successful login with valid admin credentials navigates to the product catalog', async ({
    page,
  }) => {
    await loginPage.login(users.admin.email, users.admin.password);

    await expect(page).toHaveURL(/\/#\/search/);
    await expect(page.locator('.heading')).toContainText(/All Products/i);
  });

  test('failed login with wrong password shows an error message', async () => {
    await loginPage.login(users.admin.email, 'DefinitelyNotTheRealPassword!');

    expect(await loginPage.getErrorMessage()).toContain('Invalid email or password');
  });

  test('login with empty fields keeps submit disabled so invalid credentials cannot be sent', async () => {
    await loginPage.clearCredentials();

    await expect(loginPage.getSubmitButton()).toBeDisabled();
  });
});
