import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import {
  Controller,
  Inject,
  OnApplicationBootstrap,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController implements OnApplicationBootstrap {
  public constructor(
    @Inject('NATS_CLIENT') private messageClient: ClientProxy,
    private appService: AppService,

    private configService: ConfigService,
  ) {}

  @ApiTags('Downloads')
  @Get('download/result/:uuid')
  @ApiOperation({ deprecated: false, summary: 'Downloads result files' })
  @ApiResponse({
    status: 200,
    description: 'Download all results as zip archive',
    type: Object,
  })
  public resultArchive(@Param('uuid') uId: string, @Res() res: any): void {
    const path = this.appService.downloadResultArchive(uId);
    res.download(path);
  }

  public async onApplicationBootstrap(): Promise<void> {
    await this.messageClient.connect();
  }
}
