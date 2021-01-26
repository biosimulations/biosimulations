import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthConfigService } from './strategy.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(authConfig: AuthConfigService) {
    super(authConfig.getConfig());
  }

  validate(payload: any) {
    return payload;
  }
}
