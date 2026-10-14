const { quests } = require('./quests');

function questSuite(key) {
  const quest = quests[key];

  describe(quest.title, () => {
    it('opens the correct map and introductory chapter', () => {
      cy.openQuest(key);
      cy.contains(quest.tagline).should('be.visible');
      cy.contains('Basecamp').should('be.visible');
    });

    it('opens How This Works and returns to the same map', () => {
      cy.openQuestIntro(key);
      cy.contains('a', /Back to the map/i)
        .should('be.visible')
        .click();

      cy.location('pathname').should('eq', `/q/${quest.slug}`);
      cy.contains('h1, h2', quest.title).should('be.visible');
      cy.contains('Basecamp').should('be.visible');
    });

    it('keeps the authenticated quest route after a reload', () => {
      cy.openQuest(key);
      cy.reload();
      cy.location('pathname').should('eq', `/q/${quest.slug}`);
      cy.contains('h1, h2', quest.title).should('be.visible');
    });

    it('fits the map page within a mobile viewport', () => {
      cy.viewport(390, 844);
      cy.openQuest(key);
      cy.contains('Basecamp').scrollIntoView().should('be.visible');

      cy.document().should((doc) => {
        expect(doc.documentElement.scrollWidth, 'page width')
          .to.be.at.most(doc.documentElement.clientWidth + 1);
      });
    });

    it('keeps the introductory page accessible after a reload', () => {
      cy.openQuestIntro(key);

      cy.location('pathname').then((introPath) => {
        cy.reload();
        cy.location('pathname').should('eq', introPath);
      });

      cy.contains('a', /Back to the map/i)
        .should('be.visible')
        .click();

      cy.location('pathname').should('eq', `/q/${quest.slug}`);
      cy.contains('h1, h2', quest.title).should('be.visible');
    });

    it('supports the intro and return to the map on mobile', () => {
      cy.viewport(390, 844);
      cy.openQuestIntro(key);

      cy.document().should((doc) => {
        expect(doc.documentElement.scrollWidth, 'intro page width')
          .to.be.at.most(doc.documentElement.clientWidth + 1);
      });

      cy.contains('a', /Back to the map/i)
        .scrollIntoView()
        .should('be.visible')
        .click();

      cy.location('pathname').should('eq', `/q/${quest.slug}`);
      cy.contains('Basecamp')
        .scrollIntoView()
        .should('be.visible');
    });
  });
}

module.exports = { questSuite };