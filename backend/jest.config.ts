import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/index.ts'],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  moduleNameMapper: {
    '^@middy/core$': '<rootDir>/tests/__mocks__/middy.ts',
    '^@middy/http-json-body-parser$': '<rootDir>/tests/__mocks__/middyJsonParser.ts',
    '^@middy/http-error-handler$': '<rootDir>/tests/__mocks__/middyErrorHandler.ts',
  },
};

export default config;
