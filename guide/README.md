# Interview Guide — AI-Augmented Playwright Test Framework

> A walkthrough of the project, the thinking behind it, and answers to every question raised.

---

## What Is This Project?

This is an **AI-augmented end-to-end test framework** for a banking application (ParaBank).

It combines three things:

```
Playwright          →  the test runner (browser automation)
Claude Code (AI)    →  the engineer writing and debugging tests
MCP Server          →  live browser that the AI can actually drive
```

The goal was not just to write tests — it was to build a system where an AI can **consistently** write high-quality, cross-browser, accessible tests, every time, without needing to be re-explained the conventions.

---

## The Core Problem This Solves

LLMs are non-deterministic. Ask the same question twice, get two different answers.

For a test suite, that means:
- One session: AI writes semantic locators, clean AAA structure, proper POM
- Next session: AI writes raw CSS selectors, puts assertions inside POMs, adds `waitForTimeout`

**Both outputs look reasonable. Only one is correct.**

The solution is to treat prompts like code — version-control them, load them automatically, and enforce them at the tool level.

---

## How Consistent Output Is Achieved — The Three Layers

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: CLAUDE.md                                 │
│  Loads automatically every session                  │
│  Contains: architecture, commands, skill reminders  │
│  Think of it as: the project onboarding doc         │
└─────────────────────────┬───────────────────────────┘
                          │ always present
┌─────────────────────────▼───────────────────────────┐
│  Layer 2: SKILL.md (versioned system prompt)        │
│  Loaded on demand via /playwright-skill             │
│  Contains: locator rules, test structure, POM rules │
│  Think of it as: the system instruction / agent.md  │
└─────────────────────────┬───────────────────────────┘
                          │ active during test writing
┌─────────────────────────▼───────────────────────────┐
│  Layer 3: PreToolUse Hook                           │
│  Fires before every file edit (harness-level)       │
│  Injects a reminder if skill was not invoked        │
│  Think of it as: the guardrail that cannot be skipped│
└─────────────────────────────────────────────────────┘
```

**Version controlling prompts:** `SKILL.md` is committed to git. A prompt change is a pull request. Every team member gets the updated rules on the next session. Roll back a bad rule with `git revert`.

---

## File Structure — Layer by Layer

```
Playwright-cli_claude/
│
│  ── INSTRUCTION & PERSONA LAYER ──────────────────────────────
│
├── CLAUDE.md                    ← Session instruction file
│                                  Auto-loads every time. Contains commands,
│                                  architecture overview, and which skills to invoke.
│                                  Equivalent to: instruction.md in Cursor / agent.md
│
├── SOUL.md                      ← Persona / philosophy file
│                                  The "why" behind every decision.
│                                  Guides judgment when rules don't give an answer.
│                                  Equivalent to: persona.md
│
│  ── RULE LAYER ────────────────────────────────────────────────
│
├── .claude/
│   ├── settings.json            ← AI harness config (hooks, MCP, permissions)
│   │
│   └── commands/
│       ├── playwright-skill/
│       │   ├── SKILL.md         ← Master rule file for test writing
│       │   │                      Locator priority, AAA structure, POM rules,
│       │   │                      prohibited patterns. This IS the system prompt.
│       │   │
│       │   ├── references/
│       │   │   ├── locator-guide.md    ← Rule: how to find elements
│       │   │   ├── assertion-guide.md  ← Rule: how to assert outcomes
│       │   │   └── pom-guide.md        ← Rule: page object structure + AJAX gotchas
│       │   │
│       │   ├── assets/
│       │   │   ├── spec-template.ts    ← Output format lock for new specs
│       │   │   └── pom-template.ts     ← Output format lock for new POMs
│       │   │
│       │   └── scripts/
│       │       ├── scaffold-test.ps1   ← Generates spec + POM from templates
│       │       └── hook-check.js       ← Fires before every file edit
│       │
│       └── a11y/
│           ├── SKILL.md         ← Rule file for accessibility testing
│           └── references/
│               └── checks-guide.md    ← WCAG 2.1 AA checklist
│
│  ── TEST LAYER ────────────────────────────────────────────────
│
├── tests/
│   ├── page-objects/            ← Page Object Model (one file per page)
│   │   ├── LoginPage.ts
│   │   ├── AccountsOverviewPage.ts
│   │   ├── UpdateProfilePage.ts
│   │   └── ...
│   │
│   ├── helpers/
│   │   └── a11y.ts              ← Shared: axe-core wrapper + HTML report writer
│   │
│   ├── login.spec.ts            ← Tests: login flows
│   ├── update-profile.spec.ts   ← Tests: profile update + validation
│   ├── a11y.spec.ts             ← Tests: WCAG 2.1 AA across all pages
│   └── ...
│
│  ── PROMPT & GUIDE LAYER ──────────────────────────────────────
│
├── prompts/
│   ├── README.md                ← How to work with the AI (input/output contracts)
│   └── templates/
│       ├── new-test.md          ← Copy-paste prompt for writing a new test
│       ├── debug-test.md        ← Copy-paste prompt for fixing a failing test
│       ├── a11y-test.md         ← Copy-paste prompt for accessibility tests
│       └── review.md            ← Copy-paste prompt for auditing existing tests
│
├── guide/
│   └── README.md                ← This file
│
│  ── CONFIG LAYER ──────────────────────────────────────────────
│
├── playwright.config.ts         ← 3 browsers, retries, reporters (HTML + JSON)
├── package.json                 ← Dependencies: playwright, axe-core, axe-html-reporter
└── Key-features.md              ← Full documentation with Why / How / Use for each feature
```

---

## What Each Format Is Used For

| Format | Role | Examples in this project |
|--------|------|--------------------------|
| `.md`  | Human-readable instructions, rules, prompts, philosophy | `CLAUDE.md`, `SKILL.md`, `SOUL.md`, all templates |
| `.json`| Machine config, AI harness settings, test result output | `settings.json`, `playwright-report/results.json` |
| `.ts`  | Test code, page objects, helpers, Playwright config | `*.spec.ts`, `LoginPage.ts`, `playwright.config.ts` |
| `.html`| Reports (Playwright and a11y violation reports) | `playwright-report/index.html`, `a11y-report/*.html` |

YAML is deliberately not used. `playwright.config.ts` is TypeScript — type-checked, auto-completed, caught by the compiler if wrong.

---

## MCP Integration — How the AI Gets a Live Browser

MCP (Model Context Protocol) is a standard protocol that gives the AI tools it can call.

The Playwright MCP server adds browser tools to Claude Code:

```
Claude Code (AI)
      │
      │  calls tool: browser_navigate("/parabank/transfer.htm")
      ▼
Playwright MCP Server
      │
      │  drives
      ▼
Real browser (Chromium/WebKit/Firefox)
      │
      │  returns: accessibility tree, screenshots, DOM state
      ▼
Claude Code (AI)
      │
      │  writes locators based on what it actually saw
      ▼
test file
```

**In VS Code:** the MCP server is configured in `.playwright-mcp/` and auto-connects when Claude Code opens the project.

**Without MCP:** the AI guesses locators from code. Guesses break.  
**With MCP:** the AI navigates to the live page, reads the real DOM, then writes locators. No guessing.

**Real example from this project:** a webkit/firefox bug was found by asking the AI to run `evaluate()` on the live page. It discovered that JavaScript was not removing a `display:none` inline style in those browsers — something no amount of code reading would have revealed.

---

## Accessibility Testing — Why It's in a Banking App

Banking applications must meet **WCAG 2.1 AA** under:
- ADA (USA)
- EN 301 549 (EU)
- Equality Act (UK)

A blind user must be able to check their balance. A keyboard-only user must be able to transfer funds.

The framework adds automated WCAG auditing to every page test:

```typescript
import { checkA11y, checkSingleH1, checkKeyboardNav } from './helpers/a11y';

test('Accounts overview is accessible', async ({ page }) => {
  await page.goto('/parabank/overview.htm');

  await checkA11y(page, 'Accounts-Overview');   // axe-core: 90+ WCAG rules
  await checkSingleH1(page);                     // one <h1> per page
  await checkKeyboardNav(page, 20);              // Tab through 20 interactive elements
});
```

On failure, a dedicated HTML report is written to `a11y-report/accounts-overview.html` with the violation, WCAG reference, affected HTML, and suggested fix.

---

## The Three Things That Answer "How Do You Get Consistent Output?"

**1. Skills are versioned system prompts**
`SKILL.md` is in git. It is the system instruction. It loads before every task. Changing a rule = editing the file + committing. Everyone on the team gets the updated rule. Roll back with `git revert`.

**2. Templates lock the output format**
`spec-template.ts` and `pom-template.ts` define the exact shape of every generated file. The AI fills in the content, not the structure. This eliminates format variation across sessions.

**3. Hooks enforce at the harness level**
A Node.js script fires before every file edit. If `/playwright-skill` was not invoked, it injects a reminder before the AI writes anything. This is enforcement at the tool level — it cannot be bypassed by phrasing.

---

## What to Show in the Interview

**1. The folder structure** — open this file and walk through the layer diagram above.

**2. A live skill invocation** — type `/playwright-skill` in Claude Code, show that it loads `SKILL.md` and all the rules.

**3. A test run** — run `npx playwright test --project=chromium --headed` on one spec. Show the browser driving itself.

**4. The MCP browser** — ask Claude Code to "navigate to the ParaBank login page and take a screenshot." Show it doing it live.

**5. The a11y report** — run `npx playwright test tests/a11y.spec.ts --project=chromium` and open the HTML violation report.

**6. Version-controlled prompts** — open `git log --oneline` and show that `SKILL.md` changes appear in the commit history like code changes.

---

## If Asked: "What Would You Do Next?"

- Add CI/CD pipeline (GitHub Actions) so tests run on every pull request across all three browsers
- Add visual regression testing with Playwright snapshots alongside the functional tests
- Extend the prompting system to generate test data fixtures from a schema, not hardcoded credentials
- Add a custom reporter that maps test failures to user stories / Jira tickets
