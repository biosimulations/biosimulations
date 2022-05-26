export default {
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  coverageDirectory: '../../coverage/apps/mail-service',
  displayName: 'mail-service',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
