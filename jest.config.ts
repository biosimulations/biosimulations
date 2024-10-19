const { getJestProjects } = require('@nx/jest');

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: [
    ...getJestProjects(),
    '<rootDir>/libs/messages',
    '<rootDir>/libs/dispatch/file-modifiers',
    '<rootDir>/libs/shared/exceptions',
    '<rootDir>/libs/shared/exceptions//exceptions',
  ],
};
