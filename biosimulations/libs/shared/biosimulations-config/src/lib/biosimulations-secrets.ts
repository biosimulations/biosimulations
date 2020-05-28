export const nestConfig = () => ({
  database: {
    uri: process.env.MONGODB_URI,
  },
  auth: {
    auth0_domain: process.env.AUTH0_DOMAIN,
    api_audience: process.env.API_AUDIENCE,
    auth0_client_id: process.env.AUTH0_CLIENT_ID,
    auth0_client_secret: process.env.AUTH0_CLIENT_SECRET,
  },
  port: process.env.PORT || 3333,
});


