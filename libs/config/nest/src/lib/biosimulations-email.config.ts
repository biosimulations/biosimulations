import { registerAs } from '@nestjs/config';

export default registerAs('email', () => {
  const config = {
    token: process.env.SENDGRID_TOKEN,
    successTemplate: process.env.SUCCESS_TEMPLATE,
    failureTemplate: process.env.FAILURE_TEMPLATE,
  };
  return config;
});
