import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { BillPayPage } from './page-objects/BillPayPage';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('john', 'demo');
  await expect(page).toHaveURL(/overview/);
});

// TC06 — Bill payment
test('TC06: paying a bill shows Bill Payment Complete confirmation', async ({ page }) => {
  const billPayPage = new BillPayPage(page);

  // Arrange
  await billPayPage.goto();

  // Act
  await billPayPage.payBill({
    payeeName:     'Electric Company',
    address:       '456 Power Ave',
    city:          'Austin',
    state:         'TX',
    zipCode:       '78701',
    phone:         '5559876543',
    accountNumber: '987654321',
    amount:        '75',
  });

  // Assert
  await expect(billPayPage.successMessage).toBeVisible();
  await expect(page.getByText('Electric Company')).toBeVisible();
  await expect(page.getByText('$75.00')).toBeVisible();
});
