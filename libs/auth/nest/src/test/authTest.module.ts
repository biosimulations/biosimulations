import { Module } from '@nestjs/common';
import { BiosimulationsAuthModule } from '../lib/biosimulations-auth.module';
import { AuthTestController } from './authTest.controller';

@Module({
  controllers: [AuthTestController],
  imports: [BiosimulationsAuthModule],
})
export class AuthTestModule {}
