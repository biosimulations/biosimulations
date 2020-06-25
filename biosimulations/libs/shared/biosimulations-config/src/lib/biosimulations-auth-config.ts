import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => {
  // TODO add authorization url based on the app
  const config = {
    auth0_domain: process.env.AUTH0_DOMAIN,
    api_audience: process.env.API_AUDIENCE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    management_domain: process.env.MANAGEMENT_DOMAIN,
    management_id: process.env.MANAGEMENT_ID,
    management_secret: process.env.MANAGEMENT_SECRET,
  };
  return config;
});
