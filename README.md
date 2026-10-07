# Career Quest Online | Cypress Automation

An eight-test end-to-end suite for Career Quest Online, part of The Adulting Quest, a web application I own.

This project demonstrates hands-on Cypress automation for authentication, navigation, content verification and profile workflows.

## Test coverage

| Test | What it verifies |
| --- | --- |
| Sign-in form | Email, password, sign-in button and password recovery link are visible |
| Email format validation | The browser flags an incorrectly formatted email |
| Successful login | Valid credentials open the dashboard and display the expected profile |
| Career Quest navigation | Continue opens the quest map with its heading and progress labels |
| Introductory activity | Basecamp expands, How This Works opens and Back to the map returns to the quest |
| Profile navigation | Profile opens the Adventurer's Ledger with the expected account name |
| Profile editor | The name and avatar editor opens with the saved name and closes using Cancel |
| Sign-out | Signing out returns to the sign-in form |

All eight tests passed locally in Chrome during development.

## Tools and approach

- Cypress 16.1.1
- JavaScript
- Node.js 24
- Git and GitHub
- Reusable helpers for login and navigation
- Independent test setup using Cypress's default test isolation
- Assertions for page content, form controls and destination paths
- Local credentials excluded from version control
- Credential typing hidden from the Cypress command log

## Running the tests

### 1. Install dependencies

Use Node.js 24 and npm. From the project folder, run:

```bash
npm ci
```

### 2. Configure an authorized test account

Create `cypress.env.json` in the project root:

```json
{
  "testEmail": "YOUR_TEST_ACCOUNT_EMAIL",
  "testPassword": "YOUR_TEST_ACCOUNT_PASSWORD"
}
```

This file is excluded by `.gitignore`. Real credentials are not provided in this repository.

Authenticated tests expect a dedicated Adventurer profile named
`Adulting Quest Test Teen` with Career Quest access and existing progress
so the dashboard displays Continue.

To use a different profile, update the expected profile name in the test
file and ensure its access and progress match these prerequisites.

### 3. Open Cypress

```bash
npx cypress open
```

Choose E2E Testing, select Chrome and open:

```text
cypress/e2e/career-quest.cy.js
```

### Run without the interactive test runner

```bash
npx cypress run --browser chrome
```

On Windows PowerShell, use `npm.cmd` and `npx.cmd` if script execution
settings prevent the commands above from running.

## Scope and limitations

This is an initial smoke test suite against the live application at
https://play.theadultingquest.com.

It covers selected user journeys. It does not yet verify answer
submission, XP calculations, purchases, profile saving or the complete
game experience.

The email validation test checks browser input validity without
submitting the form. The editor test checks opening and closing the
editor without changing or saving profile data.

Tests depend on the application's availability and the configured test
profile. Text changes or changes to that profile's progress may require
test updates.

## Planned improvements

- Automated execution through GitHub Actions
- Additional validation and gameplay scenarios
- Stable test selectors using data attributes
- API checks and broader browser coverage

## Author

Veronica Mitchell  
IT and QA leader | Founder, The Adulting Quest and NabbitIt