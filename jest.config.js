const { defaults } = require("jest-config");
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  jest: {
    verbose: true,
  },
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
};
