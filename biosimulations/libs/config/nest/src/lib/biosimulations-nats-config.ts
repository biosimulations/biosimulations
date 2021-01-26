import { registerAs } from '@nestjs/config';

export default registerAs('nats', () => {
  const config = {
    url: process.env.NATS_HOST,
    queue: process.env.NATS_QUEUE,
  };

  return config;
});
