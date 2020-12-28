import { Module } from '@nestjs/common';
import { MailClientService } from './mail-service-client.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest'
@Module({
  controllers: [],
  imports: [BiosimulationsConfigModule],
  providers: [MailClientService],
  exports: [MailClientService],
})
export class MailServiceClientModule { }
