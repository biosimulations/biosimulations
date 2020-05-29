import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { secretStrategy } from './secret.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [JwtStrategy, secretStrategy],
  exports: [PassportModule],
})
export class BiosimulationsAuthModule { }
