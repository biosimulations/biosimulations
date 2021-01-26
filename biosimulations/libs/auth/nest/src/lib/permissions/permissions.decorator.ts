import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiOAuth2 } from '@nestjs/swagger';
import { JwtGuard, PermissionsGuard } from '../..';

export const permissions = (...args: string[]) => {
  return applyDecorators(
    SetMetadata('permissions', args),
    ApiOAuth2(args),
    UseGuards(JwtGuard, PermissionsGuard),
  );
};
