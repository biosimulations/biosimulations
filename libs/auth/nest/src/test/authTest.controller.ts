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
  @ApiOperation({
    summary: 'Check whether the API is operational',
    description: 'Check whether the API is operational',
  })
  ping(@Req() req: any) {
    throw new ImATeapotException('Called the enpoint successfully');
  }

  @UseGuards(JwtGuard)
  @ApiOAuth2([])
  @ApiOperation({
    summary: 'Get information about the current user of the API',
    description: 'Returns information about the current user of the API, including their authentication token. This information may be helpful for debugging.',
  })
  @Get('/loggedIn')
  loggedping(@Req() req: any) {
    return req.user;
  }
  
  @UseGuards(JwtGuard, AdminGuard)
  @ApiOAuth2([])
  @ApiOperation({
    summary: 'Check whether the user has administrative privileges',
    description: 'Check whether the user has administrative privileges',
  })
  @Get('/admin')
  adminping(@Req() req: any) {
    return req.user;
  }

  @permissions('test:permissions')
  @UseGuards(JwtGuard, PermissionsGuard)
  @ApiOAuth2([])
  @ApiOperation({
    summary: 'Check whether the user has privileges to use the secured parts of API',
    description: 'Check whether the user has privileges to use the secured parts of API',
  })
  @Get('/permissions')
  testping(@Req() req: any) {
    return req.user;
  }
}
