const BasePage = require('../cores/BasePage');

class InventoryPage extends BasePage {
  static URL_PATTERN = /.*inventory\.html/;
  static EXPECTED_PRODUCT_COUNT = 6;

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.pageHeading = page.locator('[data-test="title"]');
    this.inventoryList = page.locator('[data-test="inventory-list"]');
    this.inventoryItems = page.locator('[data-test="inventory-item"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async expectPageLoaded() {
    await this.expectURL(InventoryPage.URL_PATTERN);
    await this.expectText(this.pageHeading, 'Products');
    await this.expectVisible(this.inventoryList);
  }

  /** @param {number} [count] */
  async expectProductCount(count = InventoryPage.EXPECTED_PRODUCT_COUNT) {
    await this.expectCount(this.inventoryItems, count);
  }
}

module.exports = InventoryPage;
