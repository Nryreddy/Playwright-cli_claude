import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { FindTransactionsPage } from './page-objects/FindTransactionsPage';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('john', 'demo');
  await expect(page).toHaveURL(/overview/);
});

// TC07 — Find transactions by amount
test('TC07: searching transactions by amount shows the results table', async ({ page }) => {
  const findPage = new FindTransactionsPage(page);

  // Arrange
  await findPage.goto();
  await expect(findPage.accountSelect).toBeVisible();

  // Act — search for $100; POM waits for networkidle after click
  await findPage.findByAmount('100');

  // Assert — results table must appear (AJAX-loaded)
  await expect(findPage.resultsTable).toBeVisible();
});

// TC08 — Find transactions by date range
test('TC08: searching transactions by date range shows the results table', async ({ page }) => {
  const findPage = new FindTransactionsPage(page);

  // Arrange
  await findPage.goto();
  await expect(findPage.accountSelect).toBeVisible();

  // Act — broad range to cover all existing transactions
  await findPage.findByDateRange('01-01-2024', '12-31-2026');

  // Assert
  await expect(findPage.resultsTable).toBeVisible();
});
