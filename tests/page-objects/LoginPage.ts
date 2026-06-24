import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  // ParaBank login inputs have ids but no <label for=""> association — use IDs
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly registerLink: Locator;

  constructor(private readonly page: Page) {
    // ParaBank's login inputs have id="username"/id="password"; name attribute is the fallback
    this.usernameInput = page.locator('#username, input[name="username"]').first();
    this.passwordInput = page.locator('#password, input[name="password"]').first();
    this.loginButton   = page.getByRole('button', { name: 'Log In' });
    this.errorMessage  = page.locator('.error');
    this.registerLink  = page.getByRole('link', { name: 'Register' });
  }

  async goto() {
    await this.page.goto('/parabank/index.htm');
    // Wait for the login form to be interactive before any action
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
