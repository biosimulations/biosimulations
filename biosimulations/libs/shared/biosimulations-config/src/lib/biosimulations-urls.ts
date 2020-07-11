export const urls: { [key: string]: { [key: string]: string } } = {
  prod: {
    'biosimulations-api': 'https://api.biosimulations.org',
    'account-api': 'https://account.biosimulations.org',
    'dispatch-api': 'https://dispatch-api.biosimulations.org',
  },
  dev: {
    'biosimulations-api': 'https://api.biosimulations.dev',
    'account-api': 'https://account.biosimulations.dev',
    'dispatch-api': 'https://dispatch-api.biosimulations.dev',
  },
  local: {
    'biosimulations-api': 'http://localhost:3333',
    'account-api': 'http://localhost:3333',
    'dispatch-api': 'http://localhost:3333',
  },
};
