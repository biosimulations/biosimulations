/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app/app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 4444;
  const host = process.env.HOST || 'localhost';
  // const port = app.get('ConfigService').get('dispatchService.port') || 4444;
  // const host = app.get('ConfigService').get('dispatchService.host') || 'localhost';
  await app.listen(port, () => {
    logger.log(`Listening at http://${host}:${port}/${globalPrefix}`);
  });
}

bootstrap();
