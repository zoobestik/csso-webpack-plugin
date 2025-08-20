module.exports = {
  testEnvironment: 'node',
  testRegex: '(/test/.*\\.spec\\.js)$',
  // Keep verbose for CI readability
  verbose: true,
  // Do not transform; tests run against built lib via npm run build
  transform: {},
  // Increase default timeout to accommodate webpack integration runs
  testTimeout: 20000,
};
