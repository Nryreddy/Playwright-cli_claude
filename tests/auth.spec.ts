import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';
import { RegisterPage } from './page-objects/RegisterPage';

const VALID_USER = { username: 'john', password: 'demo' };

// TC01 — Valid login
test('TC01: valid credentials redirect to accounts overview', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Arrange
  await loginPage.goto();

  // Act
  await loginPage.login(VALID_USER.username, VALID_USER.password);

  // Assert
  await expect(page).toHaveURL(/overview/);
  await expect(page.getByRole('heading', { name: 'Accounts Overview' })).toBeVisible();
});

// TC02 — Invalid login
test('TC02: invalid credentials show an error message', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Arrange
  await loginPage.goto();

  // Act
  await loginPage.login('wronguser', 'wrongpass');

  // Assert
  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText(/could not be verified/i);
});

// TC03 — Register new user
test('TC03: registering with unique credentials creates an account', async ({ page }) => {
  const registerPage = new RegisterPage(page);
  // Use last 8 digits of timestamp for a short, unique username (≤12 chars)
  const uid = Date.now().toString().slice(-8);

  // Arrange
  await registerPage.goto();

  // Act
  await registerPage.register({
    firstName: 'Test',
    lastName:  'User',
    address:   '123 Main St',
    city:      'Testville',
    state:     'TX',
    zipCode:   '75001',
    phone:     '5551234567',
    ssn:       `555${uid.slice(-6)}`,
    username:  `usr${uid}`,
    password:  'Password1!',
  });

  // Assert
  await expect(registerPage.successHeading).toBeVisible();
});

// TC10 — Logout
test('TC10: logging out returns to the home page with login form', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Arrange — log in first
  await loginPage.goto();
  await loginPage.login(VALID_USER.username, VALID_USER.password);
  await expect(page).toHaveURL(/overview/);

  // Act
  await page.getByRole('link', { name: 'Log Out' }).click();

  // Assert
  await expect(page).toHaveURL(/index/);
  await expect(loginPage.loginButton).toBeVisible();
});
