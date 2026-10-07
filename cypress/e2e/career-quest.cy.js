describe('Career Quest', () => {
  function signIn() {
    cy.visit('https://play.theadultingquest.com/auth');

    cy.env(['testEmail', 'testPassword']).then(
      ({ testEmail, testPassword }) => {
        cy.get('input[type="email"]').type(testEmail, {
          log: false,
          parseSpecialCharSequences: false
        });

        cy.get('input[type="password"]').type(testPassword, {
          log: false,
          parseSpecialCharSequences: false
        });

        cy.contains('button', /sign in\s*→/i)
          .should('be.visible')
          .and('be.enabled')
          .click();

        cy.location('pathname', { timeout: 15000 })
          .should('equal', '/');

        cy.contains('Welcome back, Adulting Quest Test Teen!')
          .should('be.visible');
      }
    );
  }

  function openCareerQuest() {
    signIn();

    cy.contains('a, button', /continue/i)
      .should('be.visible')
      .click();

    cy.location('pathname', { timeout: 15000 })
      .should('equal', '/q/career-quest');

    cy.contains('h1, h2', 'Career Quest')
      .should('be.visible');
  }

  function openProfile() {
    signIn();

    cy.contains('a, button', /^profile$/i)
      .should('be.visible')
      .click();

    cy.contains('h1, h2', /Adventurer['’]s Ledger/i)
      .should('be.visible');
  }

  it('displays the sign-in form', () => {
    cy.visit('https://play.theadultingquest.com/auth');

    cy.get('input[type="email"]')
      .should('be.visible')
      .and('be.enabled');

    cy.get('input[type="password"]')
      .should('be.visible')
      .and('be.enabled');

    cy.contains('button', /sign in\s*→/i)
      .should('be.visible')
      .and('be.enabled');

    cy.contains('Forgot your password?')
      .should('be.visible');
  });

  it('flags an incorrectly formatted email address', () => {
    cy.visit('https://play.theadultingquest.com/auth');

    cy.get('input[type="email"]')
      .type('not-an-email')
      .should(($input) => {
        expect($input[0].validity.typeMismatch).to.equal(true);
      });
  });

  it('signs in with valid credentials and displays the dashboard', () => {
    signIn();

    cy.contains('Career Quest')
      .should('be.visible');

    cy.contains('a, button', /continue/i)
      .should('be.visible');
  });

  it('opens Career Quest and displays its content', () => {
    openCareerQuest();

    cy.contains('Explore career paths and decide what comes next.')
      .should('be.visible');

    cy.contains('Steps completed')
      .should('be.visible');

    cy.contains('XP earned')
      .should('be.visible');

    cy.contains('Check-ins awaiting')
      .should('be.visible');

    cy.contains('Basecamp')
      .should('be.visible');
  });

  it('opens How This Works and returns to the Career Quest map', () => {
    openCareerQuest();

    cy.contains('Basecamp')
      .should('be.visible')
      .click();

    cy.contains('How this quest works')
      .should('be.visible');

    cy.contains(/A two-part experience\s*·\s*How This Works/i)
      .should('be.visible')
      .click();

    cy.contains('h1, h2', 'How This Works')
      .should('be.visible');

    cy.contains(
      'This is a two-part experience for an Adventurer (teen / young adult) and a Guide (parent).'
    ).should('be.visible');

    cy.contains('a', /Back to the map/i)
      .should('be.visible')
      .click();

    cy.location('pathname', { timeout: 15000 })
      .should('equal', '/q/career-quest');

    cy.contains('h1, h2', 'Career Quest')
      .should('be.visible');

    cy.contains('Basecamp')
      .should('be.visible');
  });

  it('opens Profile and displays the Adventurer ledger', () => {
    openProfile();

    cy.contains('h1, h2, h3', 'Adulting Quest Test Teen')
      .should('be.visible');

    cy.contains('a, button', /Edit name & avatar/i)
      .should('be.visible');

    cy.contains('XP follows your profile across every quest')
      .should('be.visible');
  });

  it('opens the name and avatar editor and cancels without saving', () => {
    openProfile();

    cy.contains('a, button', /Edit name & avatar/i)
      .should('be.visible')
      .click();

    cy.contains('Adventurer name')
      .should('be.visible');

    cy.get('input')
      .filter((index, input) => {
        return input.value === 'Adulting Quest Test Teen';
      })
      .should('have.length', 1)
      .and('be.visible')
      .and('be.enabled');

    cy.contains('Skin tone')
      .should('be.visible');

    cy.contains('Colorway')
      .should('be.visible');

    cy.contains('a, button', /^Save changes$/i)
      .should('exist');

    cy.contains('a, button', /^Cancel$/i)
      .click({ scrollBehavior: 'center' });

    cy.contains('a, button', /Edit name & avatar/i)
      .scrollIntoView()
      .should('be.visible');

    cy.contains('h1, h2, h3', 'Adulting Quest Test Teen')
      .should('be.visible');

    cy.contains('a, button', /^Save changes$/i)
      .should('not.exist');
  });

  it('signs out and returns to the sign-in form', () => {
    openProfile();

    cy.contains('a, button', /^sign out$/i)
      .click({ scrollBehavior: 'center' });

    cy.location('pathname', { timeout: 15000 })
      .should('equal', '/auth');

    cy.get('input[type="email"]')
      .should('be.visible')
      .and('be.enabled');

    cy.get('input[type="password"]')
      .should('be.visible')
      .and('be.enabled');

    cy.contains('button', /sign in\s*→/i)
      .should('be.visible')
      .and('be.enabled');

    cy.contains('Welcome back, Adulting Quest Test Teen!')
      .should('not.exist');
  });
});