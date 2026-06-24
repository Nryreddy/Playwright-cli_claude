# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install                                    # Install dependencies
npm run build                                  # Compile TypeScript to dist/
npx playwright test                            # Run all tests (chromium, firefox, webkit)
npx playwright test tests/mytest.spec.ts       # Run a single test file
npx playwright test --project=chromium         # Run on a specific browser
npx playwright test --headed                   # Debug with visible browser
npx playwright show-report                     # Open HTML test report
npx playwright test --ui                       # Interactive UI mode
npx ts-node example.ts                         # Run a standalone CLI script
```

## Architecture

This project has two independent layers:

**CLI scripts** — standalone TypeScript files (e.g., `example.ts`) run with `ts-node` and compiled to `dist/` via `tsc`. Use `prompt-sync` for interactive terminal input. `tsconfig.json` targets ES2020/CommonJS and includes root-level `*.ts` and `src/**/*.ts`.

**Playwright tests** — files under `tests/*.spec.ts`, run by the Playwright test runner. `playwright.config.ts` sets `testDir: './tests'` with three browser projects (chromium, firefox, webkit), fully parallel by default, retries=2/workers=1 on CI. Playwright tests are excluded from `tsc` and CLI scripts are never picked up by Playwright (no `.spec.ts` suffix).

Shared page abstractions use the **Page Object Model** and live in `tests/page-objects/`.

## Locator Priority (use in this order)

1. `page.getByRole(role, { name: /text/i })` — interactive/accessibility elements
2. `page.getByLabel(text)` — form fields with an associated label
3. `page.getByPlaceholder(text)` — inputs with placeholder but no label
4. `page.getByText(text)` — non-interactive content or structural typography
5. `page.getByTestId(id)` — `data-testid` fallback for dynamic elements without semantic landmarks

Never use raw CSS selectors (`.btn-primary`, `div > span`) or XPath unless completely unavoidable.

## Test Conventions

- **AAA structure**: Arrange (setup) → Act (interaction) → Assert (validation) within each `test()` block.
- **Web-first assertions**: Use `expect(locator).toBeVisible()` / `expect(locator).toHaveText()` to get built-in auto-waiting.
- **Independent tests**: Each test must be fully self-contained so they can run concurrently.

## Prohibited Patterns

- `page.waitForTimeout(5000)` — use dynamic assertions or `page.waitForLoadState('networkidle')` instead
- Asserting internal CSS classes or other details invisible to the user — assert visibility, text, or element properties
- Hardcoded test data that persists across unrelated tests — use dynamically generated values or isolated fixtures
- Modifying app code during a test run to force a passing state
