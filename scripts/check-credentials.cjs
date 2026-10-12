for (const key of ['CYPRESS_testEmail', 'CYPRESS_testPassword']) {
  if (!process.env[key]) {
    console.error(`Missing ${key}. Set AQ_TEST_EMAIL and AQ_TEST_PASSWORD in repository Actions secrets.`);
    process.exitCode = 1;
  }
}
