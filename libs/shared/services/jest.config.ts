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
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      stringifyContentPathRegex: '\\.html$',
      diagnostics: false,
    },
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@state/(.*)$': '<rootDir>/src/app/state/$1',
    // Map more paths as necessary
  },
  transformIgnorePatterns: ['node_modules/(?!@angular)'],
  coverageDirectory: '../../../coverage/libs/shared/services',
  displayName: 'shared-services',
};
