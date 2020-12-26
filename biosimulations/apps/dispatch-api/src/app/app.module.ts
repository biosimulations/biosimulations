import {
  SimulationFile,
  SimulationFileSchema
} from './../simulation-run/file.model';
import { SimulationRunModelSchema } from './../simulation-run/simulation-run.model';
import { Module, HttpModule, CacheModule } from '@nestjs/common';
import {
  Transport,
  ClientProxyFactory,
  NatsOptions
} from '@nestjs/microservices';
import { AppController } from './app.controller';
import { ConfigService } from '@nestjs/config';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { TypegooseModule } from 'nestjs-typegoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AppService } from './app.service';
import { SimulationRunModule } from '../simulation-run/simulation-run.module';
import { SharedExceptionsFiltersModule } from '@biosimulations/shared/exceptions/filters';
import { ResultsModule } from '../results/results.module';

import {
  AuthTestModule,
  BiosimulationsAuthModule
} from '@biosimulations/auth/nest';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
@Module({
  imports: [
    BiosimulationsConfigModule,
    BiosimulationsAuthModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: SimulationRunModel.name, schema: SimulationRunModelSchema },
      {
        name: SimulationFile.name,
        schema: SimulationFileSchema
      }
    ]),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri') || '',
        useNewUrlParser: true,
        useUnifiedTopology: true
      }),
      inject: [ConfigService]
    }),
    TypegooseModule.forRootAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri') || '',
        useNewUrlParser: true,
        useUnifiedTopology: true
      }),
      inject: [ConfigService]
    }),
    CacheModule.register(),
    SimulationRunModule,
    ResultsModule,
    SharedExceptionsFiltersModule,

    AuthTestModule
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
      inject: [ConfigService]
    }
  ]
})
export class AppModule {}
