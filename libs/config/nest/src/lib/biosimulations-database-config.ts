import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  // TODO change uri based on environment
  const config = { uri: process.env.MONGODB_URI };
  return config;
});
