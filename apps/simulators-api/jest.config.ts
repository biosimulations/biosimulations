module.exports = {
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  coverageDirectory: '../../coverage/apps/simulators-api',
  testEnvironment: 'node',
  displayName: 'simulators-api',
  preset: '../../jest.preset.ts',
};
