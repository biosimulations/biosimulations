import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Transport, MicroserviceOptions, NatsOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const natsUrl = configService.get("nats.url")
  const natsQueue = configService.get("nats.queue")
  const natsConfig: NatsOptions = {
    transport: Transport.NATS,
    options: {
      url: natsUrl,
      queue: natsQueue,
      reconnect: true
    }
  }
  app.connectMicroservice(natsConfig)
  await app.startAllMicroservicesAsync()
}

bootstrap();
