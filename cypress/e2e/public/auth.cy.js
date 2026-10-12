const { quests } = require('../../support/quests');

describe('Public authentication', () => {
  it('shows the sign-in form and recovery link', () => {
    cy.visit('/auth');
    cy.get('input[type="email"]').should('be.visible').and('be.enabled');
    cy.get('input[type="password"]').should('be.visible').and('be.enabled');
    cy.contains('button', /sign in\s*→/i).should('be.visible').and('be.enabled');
    cy.contains('Forgot your password?').should('be.visible');
  });

  it('rejects malformed email before submitting', () => {
    cy.visit('/auth');
    cy.get('input[type="email"]').type('not-an-email').should(($input) => {
      expect($input[0].validity.typeMismatch).to.eq(true);
    });
  });

  for (const quest of Object.values(quests)) {
    it(`requires authentication for ${quest.title}`, () => {
      cy.visit(`/q/${quest.slug}`);
      cy.location('pathname').should('eq', '/auth');
      cy.get('input[type="password"]').should('be.visible');
    });
  }
});
