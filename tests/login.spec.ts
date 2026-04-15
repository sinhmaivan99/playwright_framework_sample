import { test, expect } from '../fixtures/testFixtures';

test.describe('SauceDemo Login Tests', () => {
  test('Login thành công với user hợp lệ @smoke @critical', async ({
    loginPage,
    users,
  }) => {
    await loginPage.login(users.validUser.username, users.validUser.password);
    await loginPage.waitForPath(/.*inventory.html/);
  });

  test('Login thất bại với user sai thông tin @regression', async ({
    loginPage,
    users,
  }) => {
    await loginPage.login(
      users.invalidUser.username,
      users.invalidUser.password,
    );
    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match',
    );
  });

  test('Login thất bại với user bị khóa @regression @critical', async ({
    loginPage,
    users,
  }) => {
    await loginPage.login(users.lockedUser.username, users.lockedUser.password);
    await expect(loginPage.errorMessage).toContainText(
      'Sorry, this user has been locked out.',
    );
  });

  test('Inventory hiển thị sau khi login thành công @smoke', async ({
    authenticatedPage,
  }) => {
    await expect(authenticatedPage.page).toHaveURL(/.*inventory.html/);
  });
});
