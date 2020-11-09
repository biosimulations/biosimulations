module.exports = {
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../coverage/apps/account-api',
  displayName: 'account-api',
};
