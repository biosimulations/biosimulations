import { registerAs } from '@nestjs/config';

export default registerAs('server', () => {
  // What is the environment?
  const env = process.env.ENV || 'dev';

  // The name of the running app
  const app = process.env.APP || 'platformApi';

  const port = process.env.SERVER_PORT
    ? parseInt(process.env.SERVER_PORT)
    : undefined;

  const limit = process.env.SERVER_PAYLOAD_LIMIT;
  const config = {
    env,
    app,
    port,
    limit,
  };
  return config;
});
