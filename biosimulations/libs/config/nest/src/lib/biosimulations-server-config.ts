import { registerAs } from '@nestjs/config';
import { urls, appName } from '@biosimulations/config/common';

export default registerAs('server', () => {
  // What is the environment?
  const env = process.env.ENV || 'dev';

  // The name of the running app
  const app: appName = (process.env.APP as appName) || 'platformApi';

  const host = process.env.HOST || urls[app];

  const port = process.env.PORT || 3333;

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
