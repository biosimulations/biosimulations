/* eslint-disable */
export default {
  coverageDirectory: '../../coverage/apps/api',
  testEnvironment: 'node',
  displayName: 'api',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};
