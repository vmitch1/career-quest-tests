describe('Shared account and profile', () => {
  it('signs in and displays both available quests', () => {
    cy.signIn({ cacheSession: false });
    for (const slug of ['career-quest', 'alliance-quest']) {
      cy.get(`a[href="/q/${slug}"]`).should('be.visible');
    }
  });

  it('opens the active profile and its editor', () => {
    cy.openProfile();
    cy.env(['profileName']).then(({ profileName = 'Adulting Quest Test Teen' }) => {
      cy.contains('h1, h2, h3', profileName).should('be.visible');
    });
    cy.contains('a, button', /Edit name & avatar/i).should('be.visible');
    cy.contains('XP follows your profile across every quest').should('be.visible');
  });

  it('cancels the editor without changing the profile', () => {
    cy.openProfile();
    cy.contains('a, button', /Edit name & avatar/i).click();
    cy.env(['profileName']).then(({ profileName = 'Adulting Quest Test Teen' }) => {
      cy.get('input').filter((index, input) => input.value === profileName)
        .should('have.length', 1).and('be.visible').and('be.enabled');
    });
    cy.contains('Skin tone').should('be.visible');
    cy.contains('Colorway').should('be.visible');
    cy.contains('a, button', /^Save changes$/i).should('exist');
    cy.contains('a, button', /^Cancel$/i).click({ scrollBehavior: 'center' });
    cy.contains('a, button', /Edit name & avatar/i).scrollIntoView().should('be.visible');
    cy.contains('a, button', /^Save changes$/i).should('not.exist');
    cy.env(['profileName']).then(({ profileName = 'Adulting Quest Test Teen' }) => {
      cy.contains('h1, h2, h3', profileName).should('be.visible');
    });
  });

  it('signs out and blocks a protected route', () => {
    cy.openProfile();
    cy.contains('a, button', /^sign out$/i).click({ scrollBehavior: 'center' });
    cy.location('pathname').should('eq', '/auth');
    cy.get('input[type="password"]').should('be.visible');
    cy.visit('/profile');
    cy.location('pathname').should('eq', '/auth');
  });
});
