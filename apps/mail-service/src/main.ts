import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Transport, NatsOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
async function bootstrap(): Promise<void> {
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
  await app.startAllMicroservices();
}

bootstrap();
