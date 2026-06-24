import { type Page, type Locator } from '@playwright/test';

export type BillPayData = {
  payeeName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  accountNumber: string;
  amount: string;
};

export class BillPayPage {
  // Confirmed via DOM inspection: all bill-pay inputs use name attributes (no stable IDs)
  readonly payeeNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly accountNumberInput: Locator;
  readonly verifyAccountInput: Locator;
  readonly amountInput: Locator;
  readonly fromAccountSelect: Locator;
  readonly sendPaymentButton: Locator;
  readonly successMessage: Locator;

  constructor(private readonly page: Page) {
    this.payeeNameInput     = page.locator('[name="payee.name"]');
    this.addressInput       = page.locator('[name="payee.address.street"]');
    this.cityInput          = page.locator('[name="payee.address.city"]');
    this.stateInput         = page.locator('[name="payee.address.state"]');
    this.zipCodeInput       = page.locator('[name="payee.address.zipCode"]');
    this.phoneInput         = page.locator('[name="payee.phoneNumber"]');
    this.accountNumberInput = page.locator('[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('[name="verifyAccount"]');
    this.amountInput        = page.locator('[name="amount"]');
    this.fromAccountSelect  = page.locator('[name="fromAccountId"]');
    this.sendPaymentButton  = page.getByRole('button', { name: 'Send Payment' });
    this.successMessage     = page.getByText(/Bill Payment Complete/);
  }

  async goto() {
    await this.page.goto('/parabank/billpay.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async payBill(data: BillPayData) {
    await this.payeeNameInput.fill(data.payeeName);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipCodeInput.fill(data.zipCode);
    await this.phoneInput.fill(data.phone);
    await this.accountNumberInput.fill(data.accountNumber);
    await this.verifyAccountInput.fill(data.accountNumber);
    await this.amountInput.fill(data.amount);
    await this.fromAccountSelect.selectOption({ index: 0 });
    await this.sendPaymentButton.click();
  }
}
