import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor() {}
  private logger = new Logger(AppController.name);
  @MessagePattern('dispatch')
  dispatch() {
    this.logger.log('dispatching job');
  }
}
