import { Module } from '@nestjs/common';
import { MailServiceClientService } from './mail-service-client.service';

@Module({
  controllers: [],
  providers: [MailServiceClientService],
  exports: [MailServiceClientService],
})
export class MailServiceClientModule {}
