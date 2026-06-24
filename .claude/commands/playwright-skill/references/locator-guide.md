# Locator Strategy Reference

## Priority 1 — getByRole

Best for any interactive element. Matches accessible role + name.

```ts
page.getByRole('button', { name: /submit/i })
page.getByRole('link', { name: 'Get started' })
page.getByRole('heading', { name: /welcome/i, level: 1 })
page.getByRole('checkbox', { name: /accept terms/i })
page.getByRole('textbox', { name: /email/i })
```

Use regex (`/text/i`) for case-insensitive matches. Prefer exact: false for partial matches.

## Priority 2 — getByLabel

Best for form fields. Matches the associated `<label>` text.

```ts
page.getByLabel('Email address')
page.getByLabel('Password')
page.getByLabel('Date of birth')
```

Works with `aria-label` and `aria-labelledby` too.

## Priority 3 — getByPlaceholder

For inputs with placeholder text and no visible label.

```ts
page.getByPlaceholder('Search…')
page.getByPlaceholder('Enter your email')
```

## Priority 4 — getByText

For asserting or finding non-interactive content.

```ts
page.getByText('Welcome back!')
page.getByText(/\d+ results found/)
```

Scope it to avoid ambiguity:

```ts
page.locator('section#results').getByText('No items')
```

## Priority 5 — getByTestId

Last resort for dynamic or complex elements with no semantic landmark.

```ts
page.getByTestId('user-avatar-menu')
page.getByTestId('product-card-42')
```

Requires `data-testid` attribute in the app. Default attribute name is `data-testid`; configured in `playwright.config.ts` via `testIdAttribute`.

## Chaining & Scoping

Always scope locators to avoid matching unrelated elements:

```ts
const card = page.getByRole('article', { name: /order #123/ });
await card.getByRole('button', { name: /cancel/i }).click();
await expect(card.getByText(/cancelled/i)).toBeVisible();
```

## What NOT to Use

```ts
// Bad — brittle, ties tests to implementation details
page.locator('.btn-primary')
page.locator('div.card > span:nth-child(2)')
page.locator('//button[@class="submit"]')
page.$('.submit-btn')
```
