import { type Page, type Locator } from '@playwright/test';

export type RegisterData = {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  ssn: string;
  username: string;
  password: string;
};

export class RegisterPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneInput: Locator;
  readonly ssnInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmInput: Locator;
  readonly registerButton: Locator;
  readonly successHeading: Locator;

  constructor(private readonly page: Page) {
    // Confirmed via DOM inspection: all inputs use name/id = Spring MVC binding path
    this.firstNameInput = page.locator('[name="customer.firstName"]');
    this.lastNameInput  = page.locator('[name="customer.lastName"]');
    this.addressInput   = page.locator('[name="customer.address.street"]');
    this.cityInput      = page.locator('[name="customer.address.city"]');
    this.stateInput     = page.locator('[name="customer.address.state"]');
    this.zipCodeInput   = page.locator('[name="customer.address.zipCode"]');
    this.phoneInput     = page.locator('[name="customer.phoneNumber"]');
    this.ssnInput       = page.locator('[name="customer.ssn"]');
    this.usernameInput  = page.locator('[name="customer.username"]');
    this.passwordInput  = page.locator('[name="customer.password"]');
    this.confirmInput   = page.locator('[name="repeatedPassword"]');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.successHeading = page.getByText('Your account was created successfully. You are now logged in.');
  }

  async goto() {
    await this.page.goto('/parabank/register.htm');
    await this.page.waitForLoadState('domcontentloaded');
  }

  async register(data: RegisterData) {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipCodeInput.fill(data.zipCode);
    await this.phoneInput.fill(data.phone);
    await this.ssnInput.fill(data.ssn);
    await this.usernameInput.fill(data.username);
    await this.passwordInput.fill(data.password);
    await this.confirmInput.fill(data.password);
    await this.registerButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
