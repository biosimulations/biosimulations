import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getData() {
    return {
      message: 'Welcome to biosimulations-api!',
    };
  }
}
