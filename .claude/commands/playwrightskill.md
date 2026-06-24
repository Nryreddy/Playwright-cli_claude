# /playwrightskill

Invoke the Playwright skill to write, fix, scaffold, or review E2E tests in this repository.

**Usage:**
- `/playwrightskill` — apply all Playwright conventions to the current task
- `/playwrightskill scaffold <PageName>` — generate a new spec + POM pair
- `/playwrightskill review` — review open test files for violations

When this skill is invoked, load and follow all rules in `.claude/commands/playwright-skill/SKILL.md`.
Reference locator patterns from `references/locator-guide.md`, assertion patterns from `references/assertion-guide.md`, and POM patterns from `references/pom-guide.md`.
Use templates in `assets/` as the starting point for any new files.
