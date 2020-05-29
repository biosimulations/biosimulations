import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config'


@Injectable()
export class SecretStrategy extends PassportStrategy(Strategy, 'secret') {
    constructor(config: ConfigService) {
        super({
            secretOrKey: config.get('auth.client_secret'),
            jwtFromRequest: (req) => req?.body?.token,
            audience: config.get('auth.client_id'),
            issuer: 'login',
            algorithms: ['HS256'],
            ignoreExpiration: false
        })


    }
    validate(payload: any) {
        return payload;
    }
}