export default () => ({
  database: {
    host: process.env.MONGO_SERVER,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    port: process.env.MONGO_PORT || 27017,
    // Todo construct the uri from above
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
