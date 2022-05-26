const { getJestProjects } = require('@nrwl/jest');

export default {
  projects: [
    ...getJestProjects(),
    '<rootDir>/libs/messages',
    '<rootDir>/libs/dispatch/file-modifiers',
    '<rootDir>/libs/shared/exceptions',
    '<rootDir>/libs/shared/exceptions//exceptions',
  ],
};
