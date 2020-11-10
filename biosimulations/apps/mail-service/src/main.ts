import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        url: 'nats://localhost:4222',
      },
    }
  );
  app.listen(() => Logger.log('Running'));
}

bootstrap();
