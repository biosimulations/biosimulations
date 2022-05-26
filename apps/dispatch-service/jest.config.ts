export default {
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  coverageDirectory: '../../coverage/apps/dispatch-service',
  testEnvironment: 'node',
  displayName: 'dispatch-service',
  preset: '../../jest.preset.js',
};
