import { registerAs } from '@nestjs/config';

export default registerAs('nats', () => {
  const config = {
    host: process.env.NATS_HOST,
    clientPort: process.env.NATS_CLIENT_PORT,
    routePort: process.env.NATS_ROUTE_PORT,
    monitoringPort: process.env.NATS_MONITOR_PORT,
    username: process.env.NATS_USERNAME,
    password: process.env.NATS_PASSWORD,
    token: process.env.NATS_TOKEN
  };

  return config;
});
