import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PermissionsGuard } from './permissions/permissions.guard';
import { AdminGuard } from './admin/admin.guard';
import { JwtGuard } from './jwt/jwt.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { SecretStrategy } from './strategy/secret.strategy';
import { AuthConfigService } from './strategy/strategy.config';
import { AnonymousStrategy } from './strategy/anonymous.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  providers: [
    JwtStrategy,
    SecretStrategy,
    AnonymousStrategy,
    PermissionsGuard,
    JwtGuard,
    AuthConfigService,
    AdminGuard,
  ],
  exports: [PermissionsGuard, JwtGuard, AdminGuard],
})
export class BiosimulationsAuthModule { }
