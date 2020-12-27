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
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AppService } from './app.service';
import { SimulationRunModule } from '../simulation-run/simulation-run.module';
import { SharedExceptionsFiltersModule } from '@biosimulations/shared/exceptions/filters';
import { ResultsModule } from '../results/results.module';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client'
import {
  AuthTestModule,
  BiosimulationsAuthModule
} from '@biosimulations/auth/nest';

@Module({
  imports: [
    BiosimulationsConfigModule,
    BiosimulationsAuthModule,
    HttpModule,
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [BiosimulationsConfigModule,],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri') || '',
        useNewUrlParser: true,
        useUnifiedTopology: true
      }),
      inject: [ConfigService]
    }),
    SimulationRunModule,
    ResultsModule,
    SharedExceptionsFiltersModule,
    AuthTestModule,
    SharedNatsClientModule
  ],
  controllers: [AppController],
  providers: [
    AppService,

  ]
})
export class AppModule { }
