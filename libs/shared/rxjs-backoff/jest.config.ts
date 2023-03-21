/* eslint-disable */
export default {
  displayName: 'shared-rxjs-backoff',

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
  coverageDirectory: '../../../coverage/libs/shared/rxjs-backoff',
  preset: '../../../jest.preset.js',
};
