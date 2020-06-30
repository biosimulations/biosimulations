module.exports = {
  name: 'biosimulations-platform-frontend',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/biosimulations-platform-frontend',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
