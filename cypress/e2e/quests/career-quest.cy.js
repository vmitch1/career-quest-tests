const { questSuite } = require('../../support/quest-suite');

questSuite('career');

describe('Career Quest: Part 1.1 saved answers', () => {
  it('saves City and keeps it selected after a reload', () => {
    cy.openQuest('career');
    cy.visit('/q/career-quest/step/life-you-want');

    cy.contains('h1, h2', 'What Kind of Life Do You Want?')
      .should('be.visible');

    const areaOption = (name) =>
      cy.get('input[type="radio"][name="area"]')
        .closest('label')
        .contains(new RegExp(`^\\s*[☐☑✓✔]?\\s*${name}\\s*$`))
        .closest('label');

    areaOption('Suburbs').scrollIntoView().click();
    areaOption('Suburbs').find('input').should('be.checked');

    areaOption('City').scrollIntoView().click();
    areaOption('City').find('input').should('be.checked');
    areaOption('Suburbs').find('input').should('not.be.checked');

    cy.intercept({
      method: '+(POST|PATCH|PUT)',
      url: '**/rest/v1/**'
    }).as('saveAnswers');

    cy.contains('button', /Update my answers/i)
      .scrollIntoView()
      .should('be.enabled')
      .click();

    cy.wait('@saveAnswers')
      .its('response.statusCode')
      .should('be.within', 200, 299);

    cy.visit('/q/career-quest/step/life-you-want');
    cy.reload();

    areaOption('City').find('input').should('be.checked');
    areaOption('Suburbs').find('input').should('not.be.checked');
  });
});

describe('Career Quest: Part 1.2 saved answers', () => {
  it('replaces Creating things with Working with people and saves it', () => {
    const stepPath = '/q/career-quest/step/how-you-operate';

    const choices = [
      'Creating things (art, videos, ideas)',
      'Solving problems / figuring things out',
      'Working with people',
      'Organizing / planning',
      'Building / fixing / hands-on',
      'Learning new things',
      'Being active / moving around',
      'Leading or making decisions'
    ];

    const option = (text) =>
      cy.contains('label.chip', text);

    const setChoice = (text, checked) => {
      option(text)
        .find('input[type="checkbox"]')
        .then(($input) => {
          if ($input.prop('checked') !== checked) {
            option(text).scrollIntoView().click();
          }
        });

      option(text)
        .find('input[type="checkbox"]')
        .should(checked ? 'be.checked' : 'not.be.checked');
    };

    cy.openQuest('career');
    cy.visit(stepPath);

    cy.contains('h1, h2', /Let['’]s Figure Out How You Operate/i)
      .should('be.visible');

    choices.forEach((text) => {
      setChoice(text, false);
    });

    setChoice('Creating things (art, videos, ideas)', true);
    setChoice('Building / fixing / hands-on', true);
    setChoice('Leading or making decisions', true);

    setChoice('Creating things (art, videos, ideas)', false);
    setChoice('Working with people', true);

    const assertEnjoyChoices = () => {
      choices.forEach((text) => {
        const expected = [
          'Working with people',
          'Building / fixing / hands-on',
          'Leading or making decisions'
        ].includes(text);

        option(text)
          .find('input[type="checkbox"]')
          .should(expected ? 'be.checked' : 'not.be.checked');
      });
    };

    assertEnjoyChoices();

    cy.intercept({
      method: '+(POST|PATCH|PUT)',
      url: '**/rest/v1/**'
    }).as('savePath');

    cy.contains('button', /Update my path/i)
      .scrollIntoView()
      .should('be.enabled')
      .click();

    cy.wait('@savePath')
      .its('response.statusCode')
      .should('be.within', 200, 299);

    cy.visit(stepPath);
    cy.reload();

    cy.contains('h1, h2', /Let['’]s Figure Out How You Operate/i)
      .should('be.visible');

    assertEnjoyChoices();
  });
});

describe('Career Quest: Part 1.3 saved picks', () => {
  it('selects IT Support Specialist and keeps it after a reload', () => {
    const stepPath = '/q/career-quest/step/explore-careers';

    const career = () =>
      cy.contains('button', 'IT Support Specialist');

    const openStablePath = () => {
      cy.contains('button', /Stable\s*\+\s*Structured/i)
        .scrollIntoView()
        .should('be.visible')
        .click();

      career().scrollIntoView().should('be.visible');
    };

    cy.openQuest('career');
    cy.visit(stepPath);

    cy.contains('h1, h2', 'Explore Real Career Options')
      .should('be.visible');

    cy.contains('button', /Creative\s*\+\s*Flexible/i)
      .scrollIntoView()
      .should('be.visible')
      .click();

    openStablePath();

    career().then(($button) => {
      if ($button.attr('data-checked') === 'true') {
        career().click();
      }
    });

    career().should('have.attr', 'data-checked', 'false');
    career().click();
    career().should('have.attr', 'data-checked', 'true');

    cy.intercept({
      method: '+(POST|PATCH|PUT)',
      url: '**/rest/v1/**'
    }).as('savePicks');

    cy.contains('button', /Update my picks/i)
      .scrollIntoView()
      .should('be.enabled')
      .click();

    cy.wait('@savePicks')
      .its('response.statusCode')
      .should('be.within', 200, 299);

    cy.visit(stepPath);
    cy.reload();

    cy.contains('h1, h2', 'Explore Real Career Options')
      .should('be.visible');

    openStablePath();
    career().should('have.attr', 'data-checked', 'true');
  });
});

describe('Career Quest: Truth or Trick', () => {
  it('completes a round with all five Guide guesses correct', () => {
    const realCareers = [
      'IT Support Specialist',
      'Game Designer',
      'Accountant'
    ];

    const decoys = ['Floral Designer', 'Actor'];

    const summonGuide = () =>
      cy.contains('button', /List locked.*Summon the Guide/i);

    const reveal = () =>
      cy.contains('button', /Final answer: reveal the truth!/i);

    const replay = () =>
      cy.contains('button', /Play another round/i);

    const decoySelect = (number) =>
      cy.contains('select option', `Decoy ${number}:`)
        .parent('select');

    const finishExistingGuesses = () => {
      cy.get('div[class*="_questionCard_"]')
        .should('have.length', 5)
        .each(($card) => {
          cy.wrap($card).within(() => {
            cy.contains('button', /^Real$/)
              .scrollIntoView()
              .click();
          });
        });

      reveal().should('be.enabled').click();
      replay().scrollIntoView().click();
    };

    cy.openQuest('career');
    cy.visit('/q/career-quest/step/truth-or-trick');

    // Wait until the saved game stage has loaded.
    cy.get('button', { timeout: 15000 }).should(($buttons) => {
      const stageButtons = [...$buttons].filter((button) =>
        /List locked.*Summon the Guide|Play another round|Final answer: reveal the truth|I['’]m Guide and I['’]m ready/i
          .test(button.textContent)
      );

      expect(stageButtons.length, 'loaded game stage')
        .to.be.greaterThan(0);
    });

    // Finish a restored round before starting the test round.
    cy.get('body').then(($body) => {
      const text = $body.text();

      if (/Play another round/i.test(text)) {
        replay().scrollIntoView().click();
      } else if (/I['’]m Guide and I['’]m ready!/i.test(text)) {
        cy.contains('button', /I['’]m Guide and I['’]m ready!/i)
          .scrollIntoView()
          .click();

        cy.contains('Guide: mark each career Real or Decoy')
          .should('be.visible');

        finishExistingGuesses();
      } else if (/Final answer: reveal the truth!/i.test(text)) {
        finishExistingGuesses();
      }
    });

    summonGuide().should('be.visible');

    decoySelect(1).select('');
    decoySelect(2).select('');

    cy.get('label.chip[data-tone="amber"]')
      .find('input[type="checkbox"]:checked')
      .each(($input) => {
        cy.wrap($input)
          .closest('label')
          .scrollIntoView()
          .click();
      });

    summonGuide().should('be.disabled');

    realCareers.forEach((career) => {
      cy.contains('label.chip', career)
        .scrollIntoView()
        .click();

      cy.contains('label.chip', career)
        .find('input[type="checkbox"]')
        .should('be.checked');
    });

    cy.contains(/3\/3 marked real/).should('be.visible');
    summonGuide().should('be.disabled');

    decoySelect(1).select(decoys[0]);
    summonGuide().should('be.disabled');

    decoySelect(2).select(decoys[1]);
    summonGuide().should('be.enabled').click();

    cy.contains('Hand the device to Guide!')
      .should('be.visible');

    cy.contains('button', /I['’]m Guide and I['’]m ready!/i)
      .scrollIntoView()
      .click();

    cy.contains('Guide: mark each career Real or Decoy')
      .should('be.visible');

    reveal().should('be.disabled');

    const makeGuess = (career, answer) => {
      cy.contains('strong', career)
        .closest('div[class*="_questionCard_"]')
        .within(() => {
          cy.contains('button', new RegExp(`^${answer}$`))
            .scrollIntoView()
            .click();

          cy.contains('button', new RegExp(`^${answer}$`))
            .should('have.attr', 'data-active', 'true');
        });
    };

    realCareers.forEach((career) => makeGuess(career, 'Real'));
    decoys.forEach((career) => makeGuess(career, 'Decoy'));

    reveal().should('be.enabled').click();

    cy.contains('The reveal').should('be.visible');

    cy.get('div[class*="_revealRow_"]')
      .should('have.length', 5)
      .each(($row) => {
        cy.wrap($row)
          .should('have.attr', 'data-correct', 'true');
      });

    realCareers.forEach((career) => {
      cy.contains('strong', career)
        .closest('div[class*="_revealRow_"]')
        .find('.badge')
        .should('have.text', 'REAL');
    });

    decoys.forEach((career) => {
      cy.contains('strong', career)
        .closest('div[class*="_revealRow_"]')
        .find('.badge')
        .should('have.text', 'DECOY');
    });

    cy.contains(/GUIDE WINS!/i).should('be.visible');

    replay().scrollIntoView().click();
    summonGuide().should('be.visible');
  });
});