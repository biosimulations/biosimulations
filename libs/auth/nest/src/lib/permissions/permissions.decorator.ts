import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  ApiOAuth2,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import { JwtGuard, PermissionsGuard } from '../..';

export const permissions = (...args: string[]) => {
  return applyDecorators(
    SetMetadata('permissions', args),
    ApiOAuth2(args),
    UseGuards(JwtGuard, PermissionsGuard),
    ApiUnauthorizedResponse({
      type: ErrorResponseDocument,
      description: 'No authorization was provided',
    }),
    ApiForbiddenResponse({
      type: ErrorResponseDocument,
      description: `The provided account does not have the ${args} permissions`,
    }),
  );
};
