const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  projects: [
    ...getJestProjects(),
    '<rootDir>/libs/messages',
    '<rootDir>/libs/dispatch/file-modifiers',
    '<rootDir>/libs/shared/exceptions',
    '<rootDir>/libs/shared/exceptions//exceptions',
  ],
};
