import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SecretStrategy extends PassportStrategy(Strategy, 'secret') {
  constructor(config: ConfigService) {
    console.log(config.get('auth.management_secret'));
    console.log(config.get('auth.auth0_domain'));
    console.log(config.get('auth.management_id'));
    super({
      secretOrKey: config.get('auth.client_secret'),
      jwtFromRequest: (req: any) => req?.body?.token,
      audience: config.get('auth.client_id'),
      issuer: config.get('auth.auth0_domain'),
      algorithms: ['HS256'],
      ignoreExpiration: true,
    });
  }
  validate(payload: any) {
    console.log('called');
    console.log(payload);
    return payload;
  }
}
