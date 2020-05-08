import { NgxLoggerLevel } from 'ngx-logger';
export const environment = {
  production: false,
  baseUrl: '/',
  auth0: {
    domain: 'auth.biosimulations.dev',
    audience: 'api.biosimulations.org',
    clientId: '0NKMjbZuexkCgfWY3BG9C3808YsdLUrb',
  },
  logging: {
    level: NgxLoggerLevel.DEBUG,
  },
  crbm: {
    CRBMAPI_URL: 'http://localhost:5001',
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
      'omex',
      'xml',
    ],
  },
  bruitConfig: {
    apiKey: 'e6f43cf7-e04d-4581-9505-dbd7eddd9dbd',
    labels: {
      title: 'Send us feedback',
      button: 'Send',
    },
    form: [
      {
        label: 'Comments',
        type: 'textarea',
        id: 'title',
        required: true,
      },
      {
        label: 'Your name',
        type: 'text',
      },
      {
        label: 'Email',
        type: 'text',
      },
      {
        id: 'agreement',
        type: 'checkbox',
        label:
          'I agree to send a screenshot and technical information about my browser',
        value: false,
        required: true,
      },
    ],
    colors: {
      header: '#2196f3',
      body: '#eee',
      background: '#444444ee',
      errors: '#f44336',
      focus: '#2196f3',
    },
    closeModalOnSubmit: true,
  },
};
