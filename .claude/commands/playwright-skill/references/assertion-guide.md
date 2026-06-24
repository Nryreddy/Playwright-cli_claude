# Assertion Patterns Reference

All assertions must be **web-first** — they auto-wait up to the configured timeout. Never snapshot DOM state manually and then assert.

## Visibility

```ts
await expect(locator).toBeVisible();
await expect(locator).toBeHidden();
await expect(locator).toBeAttached();   // in DOM but may be hidden
```

## Text Content

```ts
await expect(locator).toHaveText('Exact string');
await expect(locator).toHaveText(/partial match/i);
await expect(locator).toContainText('substring');
```

## Input Values

```ts
await expect(input).toHaveValue('expected value');
await expect(input).toBeEmpty();
await expect(checkbox).toBeChecked();
await expect(checkbox).not.toBeChecked();
```

## Page-Level

```ts
await expect(page).toHaveURL('/dashboard');
await expect(page).toHaveURL(/\/dashboard/);
await expect(page).toHaveTitle(/Home Page/);
```

## Element State

```ts
await expect(button).toBeEnabled();
await expect(button).toBeDisabled();
await expect(locator).toBeFocused();
```

## Count & Lists

```ts
await expect(page.getByRole('listitem')).toHaveCount(5);
await expect(locator).toHaveText(['Item 1', 'Item 2', 'Item 3']);
```

## Attributes & CSS

```ts
await expect(locator).toHaveAttribute('href', '/about');
await expect(locator).toHaveAttribute('aria-expanded', 'true');
// Only assert CSS properties the user can actually perceive:
await expect(locator).toHaveCSS('display', 'none');
```

## AAA Pattern in Full

```ts
test('user submits the contact form', async ({ page }) => {
  // Arrange
  await page.goto('/contact');

  // Act
  await page.getByLabel('Name').fill('Alice');
  await page.getByLabel('Email').fill('alice@example.com');
  await page.getByLabel('Message').fill('Hello!');
  await page.getByRole('button', { name: /send/i }).click();

  // Assert
  await expect(page.getByRole('alert')).toHaveText(/message sent/i);
});
```

## Anti-Patterns

```ts
// Bad — manual snapshot, no auto-waiting
const text = await locator.textContent();
expect(text).toBe('Done');

// Bad — arbitrary sleep
await page.waitForTimeout(3000);

// Bad — asserting implementation detail
await expect(button).toHaveClass('btn-active');
```
