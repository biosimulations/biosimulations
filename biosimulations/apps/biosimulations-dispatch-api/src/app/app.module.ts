import { Module } from '@nestjs/common';
import { ClientsModule, ClientProxy, Transport, ClientProxyFactory } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DISPATCH_MQ',
        transport: Transport.NATS
      }
    ])
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    // {
    //   provide: 'DISPATCH_MQ',
    //   useFactory: (configService: ConfigService) => {
    //     const natsOptions = configService.get('nats');
    //     return ClientProxyFactory.create(natsOptions);
    //   },
    //   inject: [ConfigService],
    // }
  ],
})
export class AppModule {}
