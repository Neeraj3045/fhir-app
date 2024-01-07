// jest.config.js
module.exports = {
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
  ],
  testMatch: [
      '/tests//*.spec.ts',
      '<rootDir>/src/**/*.test.js',
      '<rootDir>/src/**/*.spec.ts',
  ],
  transform: {
      '^.+\.tsx?$': 'ts-jest',
  },
};