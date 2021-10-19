import { registerAs } from '@nestjs/config';

export default registerAs('cache', () => {
  const config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  };

  return config;
});
