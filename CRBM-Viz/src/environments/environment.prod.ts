export const environment = {
  production: true,
  baseUrl: '/',
  auth0: {
    domain: 'crbm.auth0.com',
    clientId: '0NKMjbZuexkCgfWY3BG9C3808YsdLUrb'
  },
  crbm: {
      CRBMAPI_URL: 'http://localhost:5000',
      ALLOWED_FILE_EXTENSIONS: ['pdf', 'doc', 'ppt', 'txt', 'xlsx', 'sedx', 'sbex',
          'cmex', 'sbox', 'neux', 'phex', 'zip', 'jpg', 'png', 'jpeg', 'raw', 'sh']
  }
};
