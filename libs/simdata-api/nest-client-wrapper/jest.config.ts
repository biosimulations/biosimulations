/* eslint-disable */
export default {
  displayName: 'simdata-api-nest-client-wrapper',

  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/simdata-api/nest-client-wrapper',
  preset: '../../../jest.preset.js',
};
