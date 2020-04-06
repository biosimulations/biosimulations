import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @ApiTags('Utility')
  @Get()
  getData() {
    return {
      message: 'Welcome to biosimulations-api!',
    };
  }
}
