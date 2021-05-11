import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => {
  const config = {
    endpoint: process.env.STORAGE_ENDPOINT || 'http://s3low.scality.uchc.edu',
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secret: process.env.STORAGE_SECRET,
    bucket: process.env.STORAGE_BUCKET || 'biosimdev',
    publicEndpoint: process.env.STORAGE_PUBLIC_ENDPOINT || "https://files-dev.biosimulations.org"
  };
  return config;
});
