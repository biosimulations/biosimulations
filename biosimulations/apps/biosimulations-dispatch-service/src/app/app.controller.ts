import { Controller, Get, Logger, Post, Body } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Hpc } from './utils/hpc/hpc'
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor( private readonly configService: ConfigService) {}
  private logger = new Logger(AppController.name);
  @MessagePattern('dispatch')
  // @Post('/dispatch')
  dispatch() {
  // dispatch(@Body() simSpec: object) {
    this.logger.log('dispatching job');
    // Get sim spec from message/request
    // const hpc = new Hpc(this.configService.get())
    // Call HPC manager
    // Log at each step
  }
}
