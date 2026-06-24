import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { RequestLoanPage } from './page-objects/RequestLoanPage';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('john', 'demo');
  await expect(page).toHaveURL(/overview/);
});

// TC09 — Request a loan
test('TC09: submitting a loan application shows the processed result', async ({ page }) => {
  const loanPage = new RequestLoanPage(page);

  // Arrange
  await loanPage.goto();
  await expect(loanPage.loanAmountInput).toBeVisible();
  await expect(loanPage.fromAccountSelect).toBeVisible();

  // Act — request a small loan with a 10% down payment
  await loanPage.applyForLoan('1000', '100');

  // Assert — page shows the result heading regardless of approval/denial
  await expect(loanPage.resultHeading).toBeVisible();
});
