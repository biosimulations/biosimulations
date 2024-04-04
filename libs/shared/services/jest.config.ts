/* eslint-disable */
// export default {
//   globals: {},
//   transform: {
//     '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
//   },
//   moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
//   coverageDirectory: '../../../coverage/libs/shared/services',
//   displayName: 'shared-services',
//   preset: '../../../jest.preset.js',
// };

/* eslint-disable */
export default {
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {},
  coverageDirectory: '../../../coverage/libs/shared/services',

  displayName: 'shared-services',
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  transform: {
    '^.+.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        stringifyContentPathRegex: '\\.(html|svg)$',

        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*.mjs$)'],
  testTimeout: 10000,
  preset: '../../jest.preset.js',
};
