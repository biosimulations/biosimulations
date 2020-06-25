// TODO register these as seperate namespaces
export const nestConfig = () => ({
  database: {
    uri: process.env.MONGODB_URI,
  },
  auth: {
    auth0_domain: process.env.AUTH0_DOMAIN,
    api_audience: process.env.API_AUDIENCE,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    management_domain: process.env.MANAGEMENT_DOMAIN,
    management_id: process.env.MANAGEMENT_ID,
    management_secret: process.env.MANAGEMENT_SECRET,
  },
  port: process.env.PORT || 3333,
  host: process.env.HOST || 'http://localhost/',
});
