import {
  Controller,
  Get,
  ImATeapotException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOAuth2, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../lib/admin/admin.guard';
import { JwtGuard } from '../lib/jwt/jwt.guard';
import { permissions } from '../lib/permissions/permissions.decorator';
import { PermissionsGuard } from '../lib/permissions/permissions.guard';

@ApiTags('Authentication testing')
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
