export const environment = {
  production: false,
  baseUrl: '/',
  auth0: {
    domain: 'crbm.auth0.com',
    clientId: '0NKMjbZuexkCgfWY3BG9C3808YsdLUrb',
  },
  crbm: {
    // TODO change this to heroku deployment
    CRBMAPI_URL: 'http://crbmapi.cam.uchc.edu:5000',
    ALLOWED_FILE_EXTENSIONS: [
      'pdf',
      'doc',
      'ppt',
      'txt',
      'xlsx',
      'sedx',
      'sbex',
      'cmex',
      'sbox',
      'neux',
      'phex',
      'zip',
      'jpg',
      'png',
      'jpeg',
      'raw',
      'sh',
    ],
  },
};
