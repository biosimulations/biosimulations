/* eslint-disable */
export default {
  displayName: 'shared-exceptions--exceptions',

  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/shared/exceptions//exceptions',
  preset: '../../../../jest.preset.js',
};
