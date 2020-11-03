import {
  BadRequestException,
  Controller,
  Get,
  ImATeapotException,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiOAuth2,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  JwtGuard,
  AdminGuard,
  PermissionsGuard,
  permissions,
} from '@biosimulations/auth/nest';

@ApiTags('Authentication Test')
@ApiOAuth2([])
@Controller('auth')
@ApiResponse({
  status: 418,
})
export class AuthTestController {
  @Get('/open')
  ping(@Req() req: any) {
    throw new ImATeapotException('Called the enpoint successfully');
  }
  @UseGuards(JwtGuard)
  @ApiOAuth2([])
  @ApiOperation({
    summary: 'Returns the user object',
    description: 'Returns the decoded token for debgging',
  })
  @Get('/loggedIn')
  loggedping(@Req() req: any) {
    return req.user;
  }
  @UseGuards(JwtGuard, AdminGuard)
  @ApiOAuth2([])
  @Get('/admin')
  adminping(@Req() req: any) {
    return req.user;
  }

  @permissions('test:permissions')
  @UseGuards(JwtGuard, PermissionsGuard)
  @ApiOAuth2([])
  @Get('/permissions')
  testping(@Req() req: any) {
    return req.user;
  }
}
