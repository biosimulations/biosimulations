module.exports = {
  name: 'ui-debug',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/libs/ui/debug',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
