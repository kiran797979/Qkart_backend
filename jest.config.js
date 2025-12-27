// Configuration file for testing
// https://jestjs.io/docs/configuration

module.exports = {
  testEnvironment: "node",

  // Load env variables BEFORE any test or app code runs
  setupFiles: ["<rootDir>/tests/config/testEnv.js"],

  restoreMocks: true,
};
