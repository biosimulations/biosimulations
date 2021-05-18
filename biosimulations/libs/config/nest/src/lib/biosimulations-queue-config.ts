import { registerAs } from '@nestjs/config';

export default registerAs('queue', () => {
  const config = {
    url: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  };

  return config;
});
