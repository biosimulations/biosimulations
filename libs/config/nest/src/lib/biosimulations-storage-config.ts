import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => {
  const config = {
    endpoint: process.env.STORAGE_ENDPOINT,
    externalEndpoint: process.env.STORAGE_EXTERNAL_ENDPOINT,
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secret: process.env.STORAGE_SECRET,
    bucket: process.env.STORAGE_BUCKET,
    publicEndpoint: process.env.STORAGE_PUBLIC_ENDPOINT,
  };
  return config;
});
