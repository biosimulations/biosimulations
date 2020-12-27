import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BiosimulationsConfigModule } from "@biosimulations/config/nest"
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailServiceClientModule } from '@biosimulations/mail-service/client'
import { DispatchNestClientModule } from '@biosimulations/dispatch/nest-client'
@Module({
  imports: [
    BiosimulationsConfigModule,
    DispatchNestClientModule,
    MailServiceClientModule,
    ClientsModule.register([
      {
        name: 'Nats_Client',
        transport: Transport.NATS,
        options: {
          url: 'nats://localhost:4222',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
