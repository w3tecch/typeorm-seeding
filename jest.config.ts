export default {
  collectCoverageFrom: ['src/**/!(*.d).ts'],
  preset: 'ts-jest',
  setupFiles: ['<rootDir>/test/jest-setup.ts'],
  testEnvironment: 'node',
}
