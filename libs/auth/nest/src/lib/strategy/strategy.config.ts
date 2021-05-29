import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthConfigService {
  constructor(private config: ConfigService) {}
  authConfig = {
    secretOrKeyProvider: passportJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${this.config.get('auth.auth0_domain')}.well-known/jwks.json`,
    }),

    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    audience: this.config.get('auth.api_audience'),
    issuer: this.config.get('auth.auth0_domain'),
    algorithms: ['RS256'],
  };

  getConfig() {
    return this.authConfig;
  }
}
