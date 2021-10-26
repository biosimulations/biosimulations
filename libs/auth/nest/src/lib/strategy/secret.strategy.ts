import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecretStrategy extends PassportStrategy(Strategy, 'secret') {
  public constructor(config: ConfigService) {
    const secret = config.get('auth.client_secret') || 'secret';
    super({
      secretOrKey: secret,
      jwtFromRequest: (req: any) => req?.body?.token,
      audience: config.get('auth.client_id'),
      issuer: config.get('auth.auth0_domain'),
      algorithms: ['HS256'],
      ignoreExpiration: false,
    });
  }
  public validate(payload: any): any {
    return payload;
  }
}
