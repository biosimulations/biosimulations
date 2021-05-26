module.exports = {
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  coverageDirectory: '../../coverage/apps/platform-api',
  displayName: 'platform-api',
};
