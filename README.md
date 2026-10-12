# The Adulting Quest | Shared Cypress Automation

A reusable end-to-end framework for **Career Quest** and **Alliance Quest**.
Built from Veronica Mitchell's original eight-test Career Quest suite.

## What the framework covers

| Suite | Checks | Test cases |
| --- | --- | --- |
| Public authentication | Sign-in controls, email format validation, protected routes for both games | 4 |
| Shared account | Login, both quest links, profile, cancel editor, sign-out and protected profile route | 4 |
| Career Quest | Map, introduction and return, authenticated reload, mobile page width | 4 |
| Alliance Quest | Map, introduction and return, authenticated reload, mobile page width | 4 |

**16 test cases defined.** These check navigation and introductory content; they do
not submit answers, earn XP, save profile changes, purchase access, or complete a game.
The mobile test checks page overflow at 390 x 844; it is not a visual comparison test.

## Setup on your Windows computer

Use Node.js 24. Open this folder in VS Code and use its terminal:

```powershell
npm.cmd ci
Copy-Item cypress.env.example.json cypress.env.json
```

Edit `cypress.env.json` with your dedicated test account's email and password.
Set `profileName` to the exact active Adventurer name. The default is
`Adulting Quest Test Teen`. The account must finish onboarding and be able to
open both quest maps. Paid access is not required for the introductory tests.
The tests support either Start quest or Continue, regardless of existing progress.

`cypress.env.json` is ignored by Git. Never paste credentials into test code or commit
this file. Credential typing is hidden from the command log. Failure screenshots can
still contain account information; keep them private.

## Run tests

```powershell
npm.cmd run open          # Interactive Cypress runner
npm.cmd run test:public   # No credentials needed
npm.cmd run test:account  # Shared login and profile checks
npm.cmd run test:career   # Career Quest only
npm.cmd run test:alliance # Alliance Quest only
npm.cmd test              # All 16 checks
```

The default headless browser is Electron. For installed Chrome:

```powershell
npm.cmd test -- --browser chrome
```

To target a staging deployment:

```powershell
$env:CYPRESS_BASE_URL = 'https://YOUR-STAGING-HOST'
npm.cmd test
Remove-Item Env:CYPRESS_BASE_URL
```

## Structure

```text
cypress.config.js                 Base URL, viewport, retries, JUnit reports
cypress/support/commands.js        Shared login/session, profile, quest, intro helpers
cypress/support/quests.js          Game names, routes and text
cypress/support/quest-suite.js     Shared game checks applied to both quests
cypress/e2e/public/auth.cy.js      Anonymous access checks
cypress/e2e/shared/account.cy.js   Login and profile checks
cypress/e2e/quests/                Separate game entry points
.github/workflows/                Public smoke and authenticated regression
```

`cy.session()` caches the dedicated test login, validates restored sessions against
the dashboard, and keeps tests isolated. Tests use route-specific links, semantic
navigation, labels and headings. No fixed sleeps or blanket exception suppression.
The deployed app has no `data-testid` attributes; the next selector improvement
requires David to add stable attributes to the app itself.

JUnit reports are written to `reports/`; local failures produce screenshots in
`cypress/screenshots/`. Both directories are ignored by Git.

## GitHub Actions

**Public smoke tests** run on push, pull request, or a manual run without credentials.

**Authenticated quest regression** runs only when manually requested. In GitHub,
open Settings > Secrets and variables > Actions and add:

- Secret `AQ_TEST_EMAIL`
- Secret `AQ_TEST_PASSWORD`
- Optional variable `AQ_TEST_PROFILE_NAME` (default: `Adulting Quest Test Teen`)

Then open Actions > Authenticated quest regression > Run workflow.
Missing credentials fail clearly; authenticated tests are not silently skipped.
Workflows upload JUnit reports, not account screenshots. No recurring schedule
has been enabled.

## Validation status for this framework revision

- Executed locally on Windows in Cypress 16.1.1.
- Public authentication: 4 passed.
- Shared account and profile: 4 passed.
- Career Quest: 3 passed, 1 failed.
- Alliance Quest: 3 passed, 1 failed.
- Overall: 14 passed, 2 failed.
- Both failures detected horizontal page overflow at a 390 x 844 mobile viewport.
- Defect reported to the developer; mobile checks remain enabled pending a fix.
- GitHub Actions workflows are included but have not yet been verified.

## Next gameplay coverage

Before adding answer submission and XP assertions, use a staging account with a
repeatable reset/seed mechanism. Add fixtures for expected answers, XP rules,
locked/unlocked steps, and both player roles. Validate persistence by reloading
and signing back in. Keep destructive gameplay tests separate from live smoke tests.

## Author

Veronica Mitchell | IT and QA leader | Founder, The Adulting Quest and NabbitIt

Automation portfolio: https://github.com/vmitch1/career-quest-tests
