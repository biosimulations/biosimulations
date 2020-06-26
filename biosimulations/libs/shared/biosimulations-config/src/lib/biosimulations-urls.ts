export const urls: { [key: string]: { [key: string]: string } } = {
  prod: {
    'biosimulations-api': 'https://api.biosimulations.org',
    'account-api': 'https://account.biosimulations.org',
  },
  dev: {
    'biosimulations-api': 'https://api.biosimulations.dev',
    'account-api': 'https://account.biosimulations.dev',
  },
  local: {
    'biosimulations-api': 'http://localhost:3333',
    'account-api': 'http://localhost:3333',
  },
};
