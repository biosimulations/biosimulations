import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-jwt"
import { AuthConfigService } from "./strategy.config"


@Injectable()
export class AnonymousStrategy extends PassportStrategy(Strategy, 'anonymous') {
    constructor(authConfig: AuthConfigService) {
        super(authConfig.getConfig())
    }

    authenticate() {
        return this.success({})
    }
}