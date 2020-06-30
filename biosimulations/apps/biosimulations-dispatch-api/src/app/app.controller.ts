import { Controller, Get, Inject } from '@nestjs/common';

import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy
    ) {}

  @Get('/')
  getData() {
    this.messageClient.emit('dispatch', 'Hello from DISPATCH API CLIENT!!!!!');
    return this.appService.getData();
  }

  // async OnApplicationBootstrap() {
  //   await this.messageClient.connect();
  // }
}
