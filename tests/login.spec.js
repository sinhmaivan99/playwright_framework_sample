import { test, expect } from '@playwright/test';
import LoginPage from '../pages/loginPage.js';
import users from '../fixtures/users.json';

test.describe('SauceDemo Login Tests', () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Login thành công với user hợp lệ', async ({ page }) => {
    await loginPage.login(users.validUser.username, users.validUser.password);
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  test('Login thất bại với user sai thông tin', async () => {
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

  test('Login thất bại với user bị khóa', async () => {
    await loginPage.login(users.lockedUser.username, users.lockedUser.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out.');
  });
});
