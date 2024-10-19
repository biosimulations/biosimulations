import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { ConfigService } from '@nestjs/config';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { MongooseModule } from '@nestjs/mongoose';

import { SimulationRunModule } from '../simulation-run/simulation-run.module';
import { SharedExceptionsFiltersModule } from '@biosimulations/shared/exceptions/filters';
import { ResultsModule } from '../results/results.module';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import { AuthTestModule, BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { ImagesModule } from '../images/images.module';
import { LogsModule } from '../logs/logs.module';
import { SharedStorageModule } from '@biosimulations/shared/storage';

import { BullModule } from '@nestjs/bullmq';
import { BullModuleOptions } from '@biosimulations/messages/messages';

import { MetadataModule } from '../metadata/metadata.module';
import { OntologyApiModule } from '@biosimulations/ontology/api';
import { FilesModule } from '../files/files.module';
import { SpecificationsModule } from '../specifications/specifications.module';
import { ProjectsModule } from '../projects/projects.module';
import * as redisStore from 'cache-manager-redis-store';
import { HealthModule } from '../health/health.module';
import { StatisticsApiModule } from '@biosimulations/NestSatisticsAPI';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    BiosimulationsConfigModule,
    BiosimulationsAuthModule,
    ImagesModule,
    HttpModule,
    LogsModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('cache.host'),
        port: configService.get('cache.port'),
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    MongooseModule.forRootAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri') || '',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      ...BullModuleOptions,
    }),
    SimulationRunModule,
    ResultsModule,
    MetadataModule,
    OntologyApiModule,
    SharedExceptionsFiltersModule,
    AuthTestModule,
    SharedNatsClientModule,
    SharedStorageModule,
    FilesModule,
    SpecificationsModule,
    ProjectsModule,
    StatisticsApiModule,
    RouterModule.register([
      {
        path: 'statistics',
        module: StatisticsApiModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
