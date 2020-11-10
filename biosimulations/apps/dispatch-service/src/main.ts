import { NATSQueues } from '@biosimulations/messages';
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
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      // TODO: Find a way to fetch this variables from config service
      options: {
        url: process.env.NATS_HOST + ':' + process.env.NATS_CLIENT_PORT,
        user: process.env.NATS_USERNAME,
        pass: process.env.NATS_PASSWORD,
        queue: NATSQueues.SIM_DISPATCH,
      },
    },
  );
  // const port = app.get('ConfigService').get('dispatchService.port') || 4444;
  // const host = app.get('ConfigService').get('dispatchService.host') || 'localhost';
  await app.listen(() => {
    logger.log('Dispatch service listening for *dispatch* messages');
  });
}

bootstrap();
