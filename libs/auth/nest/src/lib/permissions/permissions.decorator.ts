import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiOAuth2, ApiResponse } from '@nestjs/swagger';
//import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import { JwtGuard, PermissionsGuard } from '../..';

export const permissions = (...args: string[]) => {
  return applyDecorators(
    SetMetadata('permissions', args),
    ApiOAuth2(args),
    UseGuards(JwtGuard, PermissionsGuard),
    ApiResponse({ status: 401, description: 'You are not logged in' }),
    ApiResponse({
      status: 403,
      description: `You do not have the ${args} permissions`,
    }),
  );
};
