import { registerAs } from '@nestjs/config';

export default registerAs('email', () => {
    const config = { token: process.env.SENDGRID_TOKEN };
    return config;
});
