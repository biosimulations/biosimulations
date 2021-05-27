import { registerAs } from '@nestjs/config';

export default registerAs('queue', () => {
  const config = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  };

  return config;
});
