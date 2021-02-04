import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => {
  const config = {
    endpoint: process.env.STORAGE_ENDPOINT,
    access_key: process.env.STORAGE_ACCESS_KEY,
    secret: process.env.STORAGE_SECRET,
  };
  return config;
});
