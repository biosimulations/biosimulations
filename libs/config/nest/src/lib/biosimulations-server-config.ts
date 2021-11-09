import { registerAs } from '@nestjs/config';
import { urls, appName } from '@biosimulations/config/common';

export default registerAs('server', () => {
  // What is the environment?
  const env = process.env.ENV || 'dev';

  // The name of the running app
  const app: appName = (process.env.APP as appName) || 'platformApi';

  const host = process.env.HOST || urls[app];

  const port = process.env.SERVER_PORT
    ? parseInt(process.env.SERVER_PORT)
    : undefined;

  const limit = process.env.SERVER_PAYLOAD_LIMIT;
  const config = {
    env,
    app,
    port,
    host,
    limit,
  };
  return config;
});
