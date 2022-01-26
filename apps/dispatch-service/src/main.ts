/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { NestFactory } from '@nestjs/core';
import { NatsOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

import { ConfigService } from '@nestjs/config';
import Queue from 'bull';

import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';

import { ExpressAdapter } from '@bull-board/express';
import { JobQueue } from '@biosimulations/messages/messages';

async function bootstrap() {
  const serverAdapter = new ExpressAdapter();

  const queues: any[] = [];
  Object.values(JobQueue).forEach((value) =>
    queues.push(new BullAdapter(new Queue(value as string))),
  );

  const _ = createBullBoard({
    queues: queues,
    serverAdapter: serverAdapter,
  });
  const app = await NestFactory.create(AppModule);

  serverAdapter.setBasePath('/queues');
  app.use('/queues', serverAdapter.getRouter());
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
  const port = process.env['PORT'] || 3334;
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

bootstrap();
