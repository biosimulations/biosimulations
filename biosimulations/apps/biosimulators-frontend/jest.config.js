module.exports = {
  name: 'biosimulators-frontend',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/biosimulators-frontend',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
