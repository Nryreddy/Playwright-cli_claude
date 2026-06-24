import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { AccountsOverviewPage } from './page-objects/AccountsOverviewPage';

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('john', 'demo');
  await expect(page).toHaveURL(/overview/);
});

// TC04 — Accounts overview
test('TC04: accounts overview displays at least one account with a balance', async ({ page }) => {
  const overviewPage = new AccountsOverviewPage(page);

  // Arrange
  await overviewPage.goto();

  // Assert
  await expect(overviewPage.heading).toBeVisible();
  await expect(overviewPage.accountTable).toBeVisible();
  await expect(overviewPage.accountRows.first()).toBeVisible();
  await expect(overviewPage.totalBalance).toBeVisible();
  // row should have a clickable account number link
  await expect(overviewPage.accountRows.first().getByRole('link')).toBeVisible();
  await expect(overviewPage.getFirstAccountId()).resolves.toMatch(/^\d+$/);
  await expect(overviewPage.accountRows.first().getByRole('link').first()).toHaveAttribute('href', /activity\.htm\?id=\d+/);

  
});
