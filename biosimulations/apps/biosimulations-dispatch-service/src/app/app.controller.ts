import { Controller, Get, Logger, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Hpc } from './utils/hpc/hpc'
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { throws } from 'assert';

@Controller()
export class AppController {
  constructor( private readonly configService: ConfigService) {}
  private logger = new Logger(AppController.name);
  
  hpc.start
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

  @Post('dispatch')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file, @Body() body) {
    console.log(file);
    console.log(body);
    const simSpec = body;
    const hpc = new Hpc(
      this.configService.get('HPC_USER'),
      this.configService.get('HPC_PASS'),
      this.configService.get('HPC_HOST'),
      this.configService.get('HPC_SFTP_HOST')
    )
  }
}
