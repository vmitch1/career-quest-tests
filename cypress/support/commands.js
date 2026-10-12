const { quests } = require('./quests');

Cypress.Commands.add('signIn', ({ cacheSession = true } = {}) => {
  return cy.env(['testEmail', 'testPassword', 'profileName']).then((settings) => {
    const { testEmail, testPassword } = settings;
    const profileName = settings.profileName || 'Adulting Quest Test Teen';
    if (!testEmail || !testPassword || testEmail.startsWith('YOUR_') || testPassword.startsWith('YOUR_')) {
      throw new Error('Set testEmail and testPassword in cypress.env.json or GitHub Actions secrets. Use a dedicated test account.');
    }
    const validateDashboard = () => {
      cy.location('pathname', { timeout: 15000 }).should('eq', '/');
      cy.contains('h1', `Welcome back, ${profileName}!`).should('be.visible');
    };
    const login = () => {
      cy.visit('/auth');
      cy.get('input[type="email"]').type(testEmail, {
        log: false, parseSpecialCharSequences: false
      });
      cy.get('input[type="password"]').type(testPassword, {
        log: false, parseSpecialCharSequences: false
      });
      cy.contains('button', /sign in\s*→/i).should('be.enabled').click();
      validateDashboard();
    };
    if (!cacheSession) return login();
    // One dedicated account per run. Neither password nor email enters the session ID.
    cy.session(['aq-test-account', Cypress.config('baseUrl')], login, {
      validate() {
        cy.visit('/');
        validateDashboard();
      },
      cacheAcrossSpecs: true
    });
    // cy.session restores storage, not the page.
    cy.visit('/');
    validateDashboard();
  });
});

Cypress.Commands.add('openQuest', (key) => {
  const quest = quests[key];
  if (!quest) throw new Error(`Unknown quest key: ${key}`);
  cy.signIn();
  // Target the chosen quest, independent of its Start/Continue progress state.
  cy.get(`a[href="/q/${quest.slug}"]`).should('have.length', 1)
    .should('be.visible').click();
  cy.location('pathname').should('eq', `/q/${quest.slug}`);
  cy.contains('h1, h2', quest.title).should('be.visible');
});

Cypress.Commands.add('openProfile', () => {
  cy.signIn();
  cy.contains('a', /^profile$/i).should('be.visible').click();
  cy.location('pathname').should('eq', '/profile');
  cy.contains('h1, h2', /Adventurer['’]s Ledger/i).should('be.visible');
});

Cypress.Commands.add('openQuestIntro', (key) => {
  const quest = quests[key];
  cy.openQuest(key);
  cy.contains('summary', 'Basecamp').scrollIntoView().should('be.visible').then(($summary) => {
    if (!$summary.closest('details').prop('open')) cy.wrap($summary).click();
  });
  cy.contains('nav[aria-label="Quest chapters"] button', 'How This Works')
    .scrollIntoView().should('be.visible').and('be.enabled').click();
  cy.location('pathname').should('eq', `/q/${quest.slug}/step/how-it-works`);
  cy.contains('h1, h2', 'How This Works').should('be.visible');
});
