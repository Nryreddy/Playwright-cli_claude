import { type Page, type Locator } from '@playwright/test';

export class ___Page {
  // Locators — declared once, reused across methods
  readonly ___: Locator;

  constructor(private readonly page: Page) {
    this.___ = page.getByRole('___', { name: /___/i });
  }

  async goto() {
    await this.page.goto('/___');
  }

  // User-action methods — no assertions here
  async ___Action() {
    await this.___.click();
  }
}
