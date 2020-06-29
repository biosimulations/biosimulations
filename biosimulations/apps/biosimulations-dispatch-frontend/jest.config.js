module.exports = {
  name: 'biosimulations-dispatch-frontend',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/biosimulations-dispatch-frontend',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
