/* eslint-disable */
export default {
  displayName: 'datamodel-utils',

  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/datamodel/utils',
  preset: '../../../jest.preset.js',
};
