const { test } = require('../fixtures/testFixtures');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');

test.describe('SauceDemo Login Tests', () => {
  test('Login thành công với user hợp lệ @smoke @critical', async ({
    loginPage,
    users,
    page,
  }) => {
    await loginPage.loginAs(users.validUser);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectPageLoaded();
  });

  test('Login thất bại với user sai thông tin @regression', async ({
    loginPage,
    users,
  }) => {
    await loginPage.loginAs(users.invalidUser);
    await loginPage.expectErrorMessage(LoginPage.ERROR_MESSAGES.invalidCredentials);
  });

  test('Login thất bại với user bị khóa @regression @critical', async ({
    loginPage,
    users,
  }) => {
    await loginPage.loginAs(users.lockedUser);
    await loginPage.expectErrorMessage(LoginPage.ERROR_MESSAGES.lockedUser);
  });

  test('Inventory hiển thị sau khi login thành công @smoke', async ({
    inventoryPage,
  }) => {
    await inventoryPage.expectProductCount();
  });
});
