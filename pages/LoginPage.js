const BasePage = require('../cores/BasePage');

class LoginPage extends BasePage {
  static ERROR_MESSAGES = {
    invalidCredentials: 'Username and password do not match',
    lockedUser: 'Sorry, this user has been locked out.',
  };

  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    super(page);
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await super.goto('/');
    await this.expectVisible(this.usernameInput);
  }

  async login(username, password) {
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /** @param {{ username: string, password: string }} user */
  async loginAs(user) {
    await this.login(user.username, user.password);
  }

  async expectErrorMessage(expectedText) {
    await this.expectText(this.errorMessage, expectedText);
  }
}

module.exports = LoginPage;
