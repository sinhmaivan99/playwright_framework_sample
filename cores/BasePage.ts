import { expect, type Locator, type Page } from '@playwright/test';

export default class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(pathname = '/'): Promise<void> {
    await this.page.goto(pathname);
  }

  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async waitForPath(pathPattern: RegExp | string): Promise<void> {
    await expect(this.page).toHaveURL(pathPattern);
  }
}
