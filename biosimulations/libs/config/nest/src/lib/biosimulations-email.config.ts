import { registerAs } from '@nestjs/config';

export default registerAs('email', () => {
    const config = { uri: process.env.SENDGRID_TOKEN };
    return config;
});
