module.exports = {
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  coverageDirectory: '../../coverage/apps/api',
  testEnvironment: 'node',
  displayName: 'api',
  preset: '../../jest.preset.ts',
};
