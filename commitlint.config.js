module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'enableMultipleScopes': true,
    'body-max-line-length': async () => [1, 'always', 100],
    'footer-max-line-length': async () => [1, 'always', 100],
    'scope-enum': [
      2,
      'always',
      [
        'api',
        'platform',
        'dispatch',
        'dispatch-service',
        'simulators',
        'simulators-api',
        'account',
        'account-api',
        'mail-service',
        'combine-api',
        'auth',
        'config',
        'datamodel',
        'hdf5',
        'hsds',
        'messages',
        'ontology',
        'storage',
        'release',
        'exceptions',
        'nats-client',
        'analytics',
        'deps',
        'ui',
      ],
    ],
  },
};
