const { test: base, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const users = require('./users.json');

const test = base.extend({
  users: async ({}, use) => {
    await use(users);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  inventoryPage: async ({ page, users }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(users.validUser);
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.expectPageLoaded();
    await use(inventoryPage);
  },
});

module.exports = { test, expect };
