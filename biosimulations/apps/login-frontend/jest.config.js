module.exports = {
  name: 'login-frontend',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/login-frontend',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
