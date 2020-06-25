import { registerAs } from '@nestjs/config';
import { urls } from './biosimulations-urls';

export default registerAs('server', () => {
  // What is the environment?
  const env = process.env.ENV || 'dev';

  // The name of the running app
  const app = process.env.APP || 'biosimulations-api';

  const port = process.env.PORT || 3333;

  const host = process.env.HOST || urls[env][app];

  const limit = process.env.LIMIT || '50mb';
  const config = {
    env,
    app,
    port,
    host,
    limit,
  };
  return config;
});
