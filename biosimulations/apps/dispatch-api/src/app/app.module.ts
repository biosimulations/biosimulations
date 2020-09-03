import { SimulationIdMapService } from './SimulationIdMap/simulation-id-map.service';
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
    SimulationIdMapModule,
    HttpModule,
    MongooseModule.forRoot('mongodb://localhost/runbiosimulations', {
      connectionName: 'projectname',
    }),
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
      inject: [ConfigService, SimulationIdMapService],
    },
  ],
})
export class AppModule {}
