import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiOAuth2, ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import { JwtGuard, PermissionsGuard } from '../..';

export const permissions = (...args: string[]) => {
  return applyDecorators(
    SetMetadata('permissions', args),
    ApiOAuth2(args),
    UseGuards(JwtGuard, PermissionsGuard),
    ApiResponse({
      type: ErrorResponseDocument,
      status: 401,
      description: 'No authorization was provided',
    }),
    ApiResponse({
      type: ErrorResponseDocument,
      status: 403,
      description: `The provided account does not have the ${args} permissions`,
    }),
  );
};
