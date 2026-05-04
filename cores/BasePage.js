const { expect } = require('@playwright/test');

class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  // ── Navigation ──

  async goto(pathname = '/') {
    await this.page.goto(pathname);
  }

  // ── Interactions ──

  /** @param {import('@playwright/test').Locator} locator */
  async click(locator) {
    await locator.click();
  }

  /**
   * @param {import('@playwright/test').Locator} locator
   * @param {string} value
   */
  async fill(locator, value) {
    await locator.fill(value);
  }

  /**
   * @param {import('@playwright/test').Locator} locator
   * @returns {Promise<string>}
   */
  async getText(locator) {
    return locator.innerText();
  }

  // ── Assertions ──

  /** @param {import('@playwright/test').Locator} locator */
  async expectVisible(locator) {
    await expect(locator).toBeVisible();
  }

  /** @param {import('@playwright/test').Locator} locator */
  async expectHidden(locator) {
    await expect(locator).toBeHidden();
  }

  /**
   * @param {import('@playwright/test').Locator} locator
   * @param {string | RegExp} text
   */
  async expectText(locator, text) {
    await expect(locator).toContainText(text);
  }

  /** @param {RegExp | string} urlPattern */
  async expectURL(urlPattern) {
    await expect(this.page).toHaveURL(urlPattern);
  }

  /**
   * @param {import('@playwright/test').Locator} locator
   * @param {number} count
   */
  async expectCount(locator, count) {
    await expect(locator).toHaveCount(count);
  }
}

module.exports = BasePage;
