/* eslint-disable */
export default {
  coverageDirectory: '../../coverage/apps/api',
  testEnvironment: 'node',
  displayName: 'api',
  preset: '../../jest.preset.js',
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)', 'node_modules/(?!@angular/common/)'],
  globals: {},
};
