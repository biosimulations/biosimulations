import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => {
  const config = {
    endpoint: process.env.STORAGE_ENDPOINT,
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secret: process.env.STORAGE_SECRET,
    bucket: process.env.STORAGE_BUCKET,
  };
  return config;
});
