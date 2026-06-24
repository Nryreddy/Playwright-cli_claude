import { type Page, type Locator } from '@playwright/test';

export class FindTransactionsPage {
  // Confirmed via DOM inspection: inputs have stable IDs, buttons have unique IDs
  readonly accountSelect: Locator;

  readonly amountInput: Locator;
  readonly findByAmountButton: Locator;

  readonly fromDateInput: Locator;
  readonly toDateInput: Locator;
  readonly findByDateRangeButton: Locator;

  readonly transactionDateInput: Locator;
  readonly findByDateButton: Locator;

  readonly resultsTable: Locator;
  readonly noResultsMessage: Locator;

  constructor(private readonly page: Page) {
    this.accountSelect = page.locator('#accountId');

    this.amountInput        = page.locator('#amount');
    this.findByAmountButton = page.locator('#findByAmount');

    this.fromDateInput          = page.locator('#fromDate');
    this.toDateInput            = page.locator('#toDate');
    this.findByDateRangeButton  = page.locator('#findByDateRange');

    this.transactionDateInput = page.locator('#transactionDate');
    this.findByDateButton     = page.locator('#findByDate');

    this.resultsTable     = page.locator('#transactionTable');
    this.noResultsMessage = page.getByText(/No transactions found/i);
  }

  async goto() {
    await this.page.goto('/parabank/findtrans.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async findByAmount(amount: string) {
    await this.amountInput.fill(amount);
    await this.findByAmountButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async findByDateRange(fromDate: string, toDate: string) {
    await this.fromDateInput.fill(fromDate);
    await this.toDateInput.fill(toDate);
    await this.findByDateRangeButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
