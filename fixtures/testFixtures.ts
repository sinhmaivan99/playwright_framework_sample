import { test as base, expect, type Page } from '@playwright/test';

import LoginPage from '../pages/LoginPage';
import { users, type UserFixtureData } from './users';

type AuthenticatedContext = {
  page: Page;
  loginPage: LoginPage;
};

type AppFixtures = {
  loginPage: LoginPage;
  users: UserFixtureData;
  authenticatedPage: AuthenticatedContext;
};

export const test = base.extend<AppFixtures>({
  users: async (_context, use) => {
    await use(users);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  authenticatedPage: async ({ page, users }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.validUser.username, users.validUser.password);
    await use({ page, loginPage });
  },
});

export { expect };
