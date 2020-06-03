/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 4444;
  const host = process.env.HOST || 'localhost';
  await app.listen(port, () => {
    console.log(`Listening at http://${host}:${port}/${globalPrefix}`);
  });
}

bootstrap();
