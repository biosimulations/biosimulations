import { registerAs } from '@nestjs/config';

export default registerAs('data', () => {
  const config = {
    username: process.env.HSDS_USERNAME,
    password: process.env.HSDS_PASSWORD,
    basePath: process.env.HSDS_BASEPATH,
    externalBasePath: process.env.HSDS_EXTERNAL_BASEPATH,
    withCredentials: true,
    clientInitialInterval: process.env.HSDS_CLIENT_INITIAL_INTERVAL ? parseInt(process.env.HSDS_CLIENT_INITIAL_INTERVAL) : undefined,
    clientMaxRetries: process.env.HSDS_CLIENT_MAX_RETRIES ? parseInt(process.env.HSDS_CLIENT_MAX_RETRIES) : undefined,
  };
  return config;
});
