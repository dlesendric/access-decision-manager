/**
 * Jest configuration
 *
 * @format
 */

module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
  testPathIgnorePatterns: ['/dist/', '/node_modules/'],
};
