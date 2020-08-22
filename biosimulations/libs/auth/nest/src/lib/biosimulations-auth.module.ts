import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { SecretStrategy } from './secret.strategy';
import { AuthzService } from './authz/authz.service';
import { PermissionsGuard } from './permissions.guard';
import { JwtGuard } from './jwt.guard';
import { AuthConfigService } from './auth0/strategy.config';
import { AdminGuard } from './admin.guard';
import { AdminStrategy } from './admin.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    JwtStrategy,
    SecretStrategy,
    AuthzService,
    PermissionsGuard,
    JwtGuard,
    AuthConfigService,
    AdminGuard,
    AdminStrategy,
  ],
  exports: [AuthzService, PermissionsGuard, JwtGuard, AdminGuard],
})
export class BiosimulationsAuthModule {}
