module.exports = {
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  coverageDirectory: '../../coverage/apps/dispatch-service',
  testEnvironment: 'node',
  displayName: 'dispatch-service',
};
