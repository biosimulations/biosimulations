import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { SecretStrategy } from './secret.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, SecretStrategy],
  exports: [PassportModule],
})
export class BiosimulationsAuthModule { }
