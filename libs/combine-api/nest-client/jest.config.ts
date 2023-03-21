/* eslint-disable */
export default {
  displayName: 'combine-api-client',

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
  coverageDirectory: '../../../coverage/libs/combine/api-client',
  testEnvironment: 'node',
  preset: '../../../jest.preset.js',
};
