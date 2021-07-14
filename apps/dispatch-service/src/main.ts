/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { NatsOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const natsUrl = configService.get('nats.url');
  const natsQueue = configService.get('nats.queue');
  const natsConfig: NatsOptions = {
    transport: Transport.NATS,
    options: {
      servers: [natsUrl],
      queue: natsQueue,
      reconnect: true,
    },
  };

  app.connectMicroservice(natsConfig);
  await app.startAllMicroservicesAsync();

  app.listen('3334');
}

bootstrap();
