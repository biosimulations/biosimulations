import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOAuth2,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from 'auth0';
import { OptionalAuthGaurd } from './anoynmous.guard';
import { JwtGuard } from './jwt.guard';

export function OptionalAuth() {
  return applyDecorators(
    UseGuards(OptionalAuthGaurd),
    ApiOAuth2([]),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
