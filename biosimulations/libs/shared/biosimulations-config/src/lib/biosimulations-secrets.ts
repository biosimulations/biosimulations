export const nestConfig = () => ({
  database: {
    uri: process.env.MONGODB_URI,
  },
  auth: {
    auth0_domain: process.env.AUTH0_DOMAIN,
    api_audience: process.env.API_AUDIENCE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  },
  port: process.env.PORT || 3333,
});


