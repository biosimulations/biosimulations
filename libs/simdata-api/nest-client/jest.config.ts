/* eslint-disable */
export default {
  displayName: 'simdata-api-client',

  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/simdata/nest-client',
  testEnvironment: 'node',
  preset: '../../../jest.preset.js',
};
