import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import {
  Transport,
  ClientProxyFactory,
  ClientProxy,
} from '@nestjs/microservices';
@Module({
  imports: [BiosimulationsConfigModule],
  providers: [
    {
      provide: 'NATS_CLIENT',
      useFactory: (configService: ConfigService): ClientProxy => {
        const natsURL = configService.get('nats.url');
        return ClientProxyFactory.create({
          transport: Transport.NATS,
          options: {
            url: natsURL,
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['NATS_CLIENT'],
})
export class SharedNatsClientModule {}
