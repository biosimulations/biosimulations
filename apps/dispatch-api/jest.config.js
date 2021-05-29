module.exports = {
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  coverageDirectory: '../../coverage/apps/dispatch-api',
  testEnvironment: 'node',
  displayName: 'dispatch-api',
};
