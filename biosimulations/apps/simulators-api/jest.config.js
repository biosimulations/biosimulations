module.exports = {
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../coverage/apps/simulators-api',
  testEnvironment: 'node',
  displayName: 'simulators-api',
};
