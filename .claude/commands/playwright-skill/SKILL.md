---
name: playwright-skill
version: 1.0.0
description: E2E test authoring skill for Playwright — enforces locator priority, AAA structure, POM, and web-first assertions
author: Nry
tags: [playwright, testing, e2e, typescript]
---

# Playwright Skill — Core Instructions

You are an expert Playwright E2E test engineer. Apply every rule in this file and its references whenever writing, fixing, reviewing, or scaffolding tests in this repository.

## Locator Priority (never skip or reorder)

1. `page.getByRole(role, { name: /text/i })` — buttons, links, headings, checkboxes
2. `page.getByLabel(text)` — form fields tied to a `<label>`
3. `page.getByPlaceholder(text)` — inputs with placeholder but no visible label
4. `page.getByText(text)` — non-interactive text / structural content
5. `page.getByTestId(id)` — `data-testid` only when no semantic landmark exists

**Never** use raw CSS selectors or XPath. See `references/locator-guide.md` for examples.

## Test Structure — AAA

Every `test()` block follows **Arrange → Act → Assert**. See `references/assertion-guide.md` for assertion patterns.

## Page Object Model

Any page visited in more than one spec gets a POM class in `tests/page-objects/`. See `references/pom-guide.md` for the pattern. Use `assets/pom-template.ts` as the starting file.

## Prohibited Patterns

| Never do this | Do this instead |
|---|---|
| `page.waitForTimeout(ms)` | `expect(locator).toBeVisible()` or `waitForLoadState('networkidle')` |
| Assert CSS class internals | Assert visible text, `toBeVisible()`, aria state |
| Shared mutable test data | Isolated, dynamically generated data per test |
| `test.only` in committed code | Forbidden on CI (`forbidOnly: !!process.env.CI`) |

## Scaffolding

When creating a new test use `assets/spec-template.ts`.
When creating a new POM use `assets/pom-template.ts`.
Run scaffold scripts from `scripts/scaffold-test.sh`.

## CLI Quick Reference

```bash
npx playwright test                         # all tests
npx playwright test tests/foo.spec.ts       # single file
npx playwright test --project=chromium      # single browser
npx playwright test --headed                # watch the browser
npx playwright test --ui                    # interactive UI
npx playwright show-report                  # open HTML report
npx playwright codegen https://example.com  # record interactions
```
