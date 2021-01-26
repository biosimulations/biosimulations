import { HttpModule, Module } from '@nestjs/common';
import { AuthClientService } from './auth-client.service';

@Module({
  controllers: [],
  imports: [HttpModule],
  providers: [AuthClientService],
  exports: [AuthClientService],
})
export class AuthClientModule {}
