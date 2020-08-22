module.exports = {
  name: 'account-api',
  testEnvironment: "node",
  preset: '../../jest.config.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../coverage/apps/account-api',
};
