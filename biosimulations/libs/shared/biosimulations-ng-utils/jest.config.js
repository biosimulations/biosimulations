module.exports = {
  name: 'shared-biosimulations-ng-utils',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/shared/biosimulations-ng-utils',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
