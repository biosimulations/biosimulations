import { registerAs } from '@nestjs/config';

export default registerAs('nats', () => {
  const config = {
    url: process.env.NATS_HOST + ':' + process.env.NATS_CLIENT_PORT,
    user: process.env.NATS_USERNAME,
    pass: process.env.NATS_PASSWORD,
    // clientPort: process.env.NATS_CLIENT_PORT,
    // routePort: process.env.NATS_ROUTE_PORT,
    // monitoringPort: process.env.NATS_MONITOR_PORT,
    // token: process.env.NATS_TOKEN
  };

  return config;
});
