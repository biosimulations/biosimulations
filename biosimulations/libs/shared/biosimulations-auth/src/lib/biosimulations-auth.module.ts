import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { SecretStrategy } from './secret.strategy';
import { AuthzService } from './authz/authz.service';
import { PermissionsGuard } from './permissions.guard';
import { JwtGuard } from './jwt.guard';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [
    JwtStrategy,
    SecretStrategy,
    AuthzService,
    PermissionsGuard,
    JwtGuard,
  ],
  exports: [PassportModule, AuthzService, PermissionsGuard, JwtGuard],
})
export class BiosimulationsAuthModule {}
