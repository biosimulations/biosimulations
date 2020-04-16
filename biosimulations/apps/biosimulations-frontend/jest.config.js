module.exports = {
  name: 'biosimulations-frontend',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/myapp',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
