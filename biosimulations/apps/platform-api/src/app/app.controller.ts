import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import { JwtGuard, AdminGuard } from '@biosimulations/auth/nest';
import { AuthToken } from '@biosimulations/auth/common';
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  // TODO move these utility functions to separate module/library for use in other apps
  @ApiTags('Utility')
  @Get('ping')
  getData() {
    return 'pong';
  }

  @UseGuards(JwtGuard)
  @ApiOAuth2([])
  @ApiTags('Utility')
  @Get('hello')
  getUser(@Req() req: Request) {
    const user: AuthToken = req.user as any;
    return `Welcome ${user['https://biosimulations.org/user_metadata'].username}`;
  }

  @UseGuards(AdminGuard)
  @ApiOAuth2([])
  @ApiTags('Utility')
  @Get('helloAdmin')
  adminOnly(@Req() req: Request) {
    const user: AuthToken = req.user as any;
    return `Welcome ${user['https://biosimulations.org/user_metadata'].username}`;
  }
}
