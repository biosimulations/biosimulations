/* eslint-disable */
export default {
  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../coverage/libs/config/common',
  displayName: 'config-common',
  setupFiles: ['./jest.env.ts'],
  preset: '../../../jest.preset.js',
};
