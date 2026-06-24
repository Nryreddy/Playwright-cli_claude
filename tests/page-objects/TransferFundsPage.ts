import { type Page, type Locator } from '@playwright/test';

export class TransferFundsPage {
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly toAccountSelect: Locator;
  readonly transferButton: Locator;
  readonly successHeading: Locator;
  readonly transferredAmount: Locator;

  constructor(private readonly page: Page) {
    this.amountInput       = page.locator('#amount');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.toAccountSelect   = page.locator('#toAccountId');
    this.transferButton    = page.getByRole('button', { name: 'Transfer' });
    this.successHeading    = page.getByRole('heading', { name: 'Transfer Complete!' });
    this.transferredAmount = page.locator('#amount + b, #showResult b').first();
  }

  async goto() {
    await this.page.goto('/parabank/transfer.htm');
  }

  async transfer(amount: string, fromIndex = 0, toIndex = 1) {
    await this.amountInput.fill(amount);
    await this.fromAccountSelect.selectOption({ index: fromIndex });
    await this.toAccountSelect.selectOption({ index: toIndex });
    await this.transferButton.click();
  }
}
