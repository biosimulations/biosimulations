import { Module } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  controllers: [],
  imports: [HttpModule],
  providers: [AuthClientService],
  exports: [AuthClientService],
})
export class AuthClientModule {}
