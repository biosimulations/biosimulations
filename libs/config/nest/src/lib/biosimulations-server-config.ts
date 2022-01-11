import { registerAs } from '@nestjs/config';
import { appName } from '@biosimulations/config/common';
import { envs } from '@biosimulations/shared/environments';

export default registerAs('server', () => {
  // What is the environment?
  const env: envs = (process.env.ENV as envs) || 'dev';

  // The name of the running app
  const app: appName = (process.env.APP as appName) || 'platformApi';

  const host = process.env.HOST;

  const port = process.env.SERVER_PORT
    ? parseInt(process.env.SERVER_PORT)
    : undefined;

  const limit = process.env.SERVER_PAYLOAD_LIMIT || '71mb';
  const config = {
    env,
    app,
    port,
    host,
    limit,
  };
  return config;
});
