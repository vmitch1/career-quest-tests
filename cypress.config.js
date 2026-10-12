const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 800,
  video: false,
  screenshotOnRunFailure: true,
  retries: { runMode: 1, openMode: 0 },
  reporter: 'junit',
  reporterOptions: {
    mochaFile: 'reports/results-[hash].xml',
    toConsole: true
  },
  e2e: {
    baseUrl: 'https://play.theadultingquest.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    testIsolation: true,
    defaultCommandTimeout: 10000
  }
});
