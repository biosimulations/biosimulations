import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthToken } from '@biosimulations/auth/common';
import { AuthConfigService } from './auth0/strategy.config';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
  constructor(config: ConfigService, authConfig: AuthConfigService) {
    super(authConfig.getConfig());
  }

  validate(payload: AuthToken) {
    if (payload['https://biosimulations.org/app_metadata'].admin) {
      return payload;
    } else {
      throw new ForbiddenException(
        'You must be an admin to access this resource'
      );
    }
  }
}
