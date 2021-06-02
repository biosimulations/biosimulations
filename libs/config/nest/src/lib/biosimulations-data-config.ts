import { registerAs } from '@nestjs/config';

export default registerAs('data', () => {
  const config = {
    username: process.env.HSDS_USERNAME,
    password: process.env.HSDS_PASSWORD,
    basePath: process.env.HSDS_BASEPATH,
    withCredentials: true,
  };
  return config;
});
