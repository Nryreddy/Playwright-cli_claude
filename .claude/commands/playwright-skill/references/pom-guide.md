# Page Object Model (POM) Guide

## When to Create a POM

Create a POM class in `tests/page-objects/` whenever:
- A page or component is visited in more than one spec file
- A page has more than ~5 locators or 3 repeated interaction sequences

## File Naming

| Page | File |
|---|---|
| Login page | `tests/page-objects/LoginPage.ts` |
| Dashboard | `tests/page-objects/DashboardPage.ts` |
| Shared nav | `tests/page-objects/NavComponent.ts` |

## POM Structure Rules

- Declare all locators as `readonly` properties on the class (not inside methods)
- Methods represent **user actions**, not implementation steps
- Methods return `void` or `Promise<void>` — never return locators
- Navigation methods (`goto`) belong in the POM, not the test
- Never put assertions inside POM methods — keep them in the test

## Example

```ts
// tests/page-objects/LoginPage.ts
import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorBanner: Locator;

  constructor(private readonly page: Page) {
    this.emailInput    = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton  = page.getByRole('button', { name: /sign in/i });
    this.errorBanner   = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

## Using a POM in a Spec

```ts
import { test, expect } from '@playwright/test';
import { LoginPage } from './page-objects/LoginPage';

test('valid credentials redirect to dashboard', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Arrange
  await loginPage.goto();

  // Act
  await loginPage.login('user@example.com', 'correct-password');

  // Assert — assertion lives in the test, not the POM
  await expect(page).toHaveURL(/\/dashboard/);
});

test('invalid credentials show error', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('user@example.com', 'wrong-password');
  await expect(loginPage.errorBanner).toHaveText(/invalid credentials/i);
});
```

## Composing POMs

For shared UI (nav, footer, modal), create a component POM and compose it:

```ts
export class DashboardPage {
  readonly nav: NavComponent;
  readonly welcomeHeading: Locator;

  constructor(private readonly page: Page) {
    this.nav            = new NavComponent(page);
    this.welcomeHeading = page.getByRole('heading', { name: /welcome/i });
  }
}
```
