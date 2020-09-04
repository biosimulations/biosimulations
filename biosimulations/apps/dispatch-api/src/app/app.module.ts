import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Transport,
  ClientProxyFactory,
  NatsOptions,
} from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { SimulationIdMapModule } from './SimulationIdMap/simulation-id-map.module';

@Module({
  imports: [
    BiosimulationsConfigModule,
    HttpModule,
    SimulationIdMapModule,
    MongooseModule.forRoot('mongodb://localhost/runbiosimulations'),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'DISPATCH_MQ',
      useFactory: (configService: ConfigService) => {
        const natsServerConfig = configService.get('nats');
        const natsOptions: NatsOptions = {};
        natsOptions.transport = Transport.NATS;
        natsOptions.options = natsServerConfig;
        return ClientProxyFactory.create(natsOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
