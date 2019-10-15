export const environment = {
  production: false,
  baseUrl: '/',
  auth0: {
      domain: 'dev-t2vyo8fj.auth0.com',
      clientId: '6euIYB0EPMSNjsPEjrNZAMmpiuVCRYNB'
  },
  crbm: {
      CRBMAPI_URL: 'http://localhost:5000',
      ALLOWED_FILE_EXTENSIONS: ['pdf', 'doc', 'ppt', 'txt', 'xlsx', 'sedx', 'sbex',
          'cmex', 'sbox', 'neux', 'phex', 'zip', 'jpg', 'png', 'jpeg', 'raw', 'sh']
  }
};