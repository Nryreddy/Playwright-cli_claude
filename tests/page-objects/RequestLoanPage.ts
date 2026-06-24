import { type Page, type Locator } from '@playwright/test';

export class RequestLoanPage {
  readonly loanAmountInput: Locator;
  readonly downPaymentInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly applyButton: Locator;
  readonly resultHeading: Locator;
  readonly loanStatus: Locator;

  constructor(private readonly page: Page) {
    this.loanAmountInput  = page.locator('#amount');
    this.downPaymentInput = page.locator('#downPayment');
    this.fromAccountSelect = page.locator('#fromAccountId');
    this.applyButton      = page.getByRole('button', { name: 'Apply Now' });
    this.resultHeading    = page.getByRole('heading', { name: 'Loan Request Processed' });
    this.loanStatus       = page.locator('#loanRequestApproved, #loanRequestDenied');
  }

  async goto() {
    await this.page.goto('/parabank/requestloan.htm');
  }

  async applyForLoan(loanAmount: string, downPayment: string) {
    await this.loanAmountInput.fill(loanAmount);
    await this.downPaymentInput.fill(downPayment);
    await this.applyButton.click();
  }
}
