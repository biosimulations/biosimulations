import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { AuthConfigService } from './auth0/strategy.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, authConfig: AuthConfigService) {
    super(authConfig.getConfig());
  }

  validate(payload: any) {
    if (payload) {
      return payload;
    } else {
      throw new UnauthorizedException(
        'You must log in to access this resource'
      );
    }
  }
}
