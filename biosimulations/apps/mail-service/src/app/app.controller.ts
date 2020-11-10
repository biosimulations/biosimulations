import { Controller, Get, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  JsonSocket,
  MessagePattern,
  NatsContext,
  Payload,
} from '@nestjs/microservices';

import { AppService } from './app.service';
class dataInput {
  hello!: string;
}
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('Nats_Client') private client: ClientProxy
  ) {}

  @EventPattern('test.ping')
  async getData(@Payload() payload: any, @Ctx() context: NatsContext) {
    console.log('Staring Routine 1. Sending Message');
    this.client
      .send('test.echo', { hello: 'world' })
      .subscribe((reply) => console.log('Got reply'));

    return this.appService.getData();
  }

  @MessagePattern('test.echo')
  echoData(@Payload() data: dataInput, @Ctx() context: NatsContext) {
    console.log('Starting Routine 2');

    return data;
  }
  @MessagePattern('test.context')
  echoContext(@Payload() data: any, @Ctx() context: NatsContext) {
    return context;
  }

  @EventPattern('>')
  log(@Payload() data: dataInput, @Ctx() context: NatsContext) {
    console.log(data);
    console.log(context);
  }
}
