import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { TransferFundsPage } from './page-objects/TransferFundsPage';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('john', 'demo');
  await expect(page).toHaveURL(/overview/);
});

// TC05 — Transfer funds
test('TC05: transferring funds between accounts shows Transfer Complete', async ({ page }) => {
  const transferPage = new TransferFundsPage(page);

  // Arrange
  await transferPage.goto();
  await expect(transferPage.fromAccountSelect).toBeVisible();
  await expect(transferPage.toAccountSelect).toBeVisible();

  // Act — transfer $50 from first account to second account
  await transferPage.transfer('50', 0, 1);

  // Assert
  await expect(transferPage.successHeading).toBeVisible();
  await expect(page.getByText('$50.00')).toBeVisible();
});
