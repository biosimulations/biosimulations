import { Controller, Get, Inject, OnApplicationBootstrap, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { OmexFile } from './types/omex-file/omex-file';
import { SimulationSpec } from './types/simulation-spec/simulation-spec';

@Controller()
export class AppController implements OnApplicationBootstrap {
  constructor(
    private readonly appService: AppService,
    @Inject('DISPATCH_MQ') private messageClient: ClientProxy
    ) {}

    @Post('dispatch')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(@UploadedFile() file: OmexFile, @Body() body: SimulationSpec) {
    this.messageClient.emit('dispatch', 'Hello from DISPATCH API CLIENT!!!!!');
    return this.appService.getData();
  }

  async onApplicationBootstrap() {
    await this.messageClient.connect();
  }
}
