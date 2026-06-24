import { type Page, type Locator } from '@playwright/test';

export class AccountsOverviewPage {
  readonly heading: Locator;
  readonly accountTable: Locator;
  readonly accountRows: Locator;
  readonly totalBalance: Locator;

  constructor(private readonly page: Page) {
    this.heading      = page.getByRole('heading', { name: 'Accounts Overview' });
    this.accountTable = page.locator('#accountTable');
    this.accountRows  = page.locator('#accountTable tbody tr');
    this.totalBalance = page.locator('#accountTable tr').filter({ hasText: 'Total' }).locator('td:nth-child(2)');
  }

  async goto() {
    await this.page.goto('/parabank/overview.htm');
  }

  async getFirstAccountId(): Promise<string> {
    const text = await this.accountRows.first().getByRole('link').first().textContent();
    return (text ?? '').trim();
  }
}
