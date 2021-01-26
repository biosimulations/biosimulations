import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiOAuth2,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OptionalAuthGaurd } from './anoynmous.guard';

export function OptionalAuth() {
  return applyDecorators(
    UseGuards(OptionalAuthGaurd),
    ApiOAuth2([]),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
