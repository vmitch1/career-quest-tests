# The Adulting Quest | Shared Cypress Automation

A reusable end-to-end test framework for **Career Quest** and **Alliance Quest**.
Built from Veronica Mitchell's original eight-test Career Quest suite.

## Test coverage

| Suite | Checks | Test cases |
| --- | --- | --- |
| Public authentication | Sign-in controls, email format validation, protected routes for both games | 4 |
| Shared account | Login, both quest links, profile, cancel editor, sign-out and protected profile route | 4 |
| Career Quest | Map, introduction and return, authenticated reload, mobile page width | 4 |
| Alliance Quest | Map, introduction and return, authenticated reload, mobile page width | 4 |

**16 test cases defined.** Coverage includes authentication, navigation, profile
controls, introductory content, session persistence, and mobile page overflow.

The suite does not yet cover answer submission, XP calculations, saved profile
changes, purchases, or complete gameplay. Mobile checks detect horizontal overflow
at a 390 × 844 viewport; they are not visual comparison tests.

## Tools and approach

- Cypress 16.1.1 and JavaScript
- Node.js 24
- Shared commands for login, sessions, profiles, and quest navigation
- A reusable quest suite applied to both games
- Independent tests using Cypress test isolation
- Route-specific links, form controls, text, and headings for selectors
- JUnit reports and local failure screenshots
- GitHub Actions for JavaScript syntax validation

## Local setup on Windows

Open the project folder in VS Code and use its terminal:

```powershell
npm.cmd ci
Copy-Item cypress.env.example.json cypress.env.json
```

Edit the local `cypress.env.json` file with a dedicated test account's email,
password, and active Adventurer profile name.

The default profile name is `Adulting Quest Test Teen`. The account must complete
onboarding and be able to open both quest maps. Paid access is not required for
the introductory tests. Tests support either Start quest or Continue.

### Credentials

`cypress.env.json` is excluded from version control by `.gitignore`.

Keep credentials in local configuration, not in test code. Do not commit the
credentials file. Credential typing is hidden from the Cypress command log.
Failure screenshots may contain account information and should remain private.

## Run functional tests locally

```powershell
npm.cmd run open          # Interactive Cypress runner
npm.cmd run test:public   # Public checks; no credentials needed
npm.cmd run test:account  # Shared login and profile checks
npm.cmd run test:career   # Career Quest checks
npm.cmd run test:alliance # Alliance Quest checks
npm.cmd test              # All 16 checks
```

To run all tests in headless Chrome:

```powershell
npm.cmd test -- --browser chrome
```

To run only the public tests in headless Chrome:

```powershell
npm.cmd run test:public -- --browser chrome
```

## Framework structure

```text
cypress.config.js                 Base URL, viewport, retries, JUnit reports
cypress/support/commands.js        Shared login, session, profile and quest helpers
cypress/support/quests.js          Quest names, routes and text
cypress/support/quest-suite.js     Reusable checks applied to both quests
cypress/e2e/public/auth.cy.js      Public authentication checks
cypress/e2e/shared/account.cy.js   Account and profile checks
cypress/e2e/quests/                Career Quest and Alliance Quest entry points
scripts/check-syntax.cjs          JavaScript syntax validation
.github/workflows/                GitHub Actions syntax-check workflow
```

`cy.session()` caches the dedicated test login and validates restored sessions
against the dashboard. Tests use no fixed sleeps or blanket exception suppression.

JUnit reports are written to `reports/`. Local failures produce screenshots in
`cypress/screenshots/`. Both directories are excluded from version control.

## GitHub Actions

**Framework syntax checks** run on pushes, pull requests, and manual requests.

The workflow uses Node.js 24 and runs:

```bash
npm run check
```

This parses the framework's JavaScript files for syntax errors. It does not run
Cypress, contact production, or require account secrets.

Functional tests run locally. A passing GitHub syntax check confirms valid
JavaScript syntax, not passing application behavior.

## Validation results

All 16 checks passed locally:

- Public authentication: 4 passed
- Account and profile: 4 passed
- Career Quest: 4 passed
- Alliance Quest: 4 passed

The previously reported mobile overflow failures passed after the website update.

On October 13, 2026, the four public authentication checks also passed locally
in both interactive Chrome and headless Chrome.

The GitHub Actions syntax-check workflow passed after the workflow update.

Earlier GitHub-hosted functional runs encountered HTTP 403 responses from
production. A diagnostic request confirmed a Cloudflare challenge page. Production
functional testing is therefore performed locally, separately from GitHub syntax
validation.

## Future coverage

- Answer submission and validation
- XP calculations
- Locked and unlocked quest steps
- Both Adventurer and Guide journeys
- Persistence after reload and sign-in

Tests that modify gameplay data will require dedicated test data and a repeatable
reset process.

## Author

Veronica Mitchell | IT and QA leader | Founder, The Adulting Quest and NabbitIt

Automation portfolio: https://github.com/vmitch1/career-quest-tests
