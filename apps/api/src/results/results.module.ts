/**
 * @file Module that declares the results controller for the api, the service that implements the controller methods, and the mongoose models. Requires the Mongoose root module to be availalble in the application.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ResultsModel, ResultsSchema } from './results.model';
import {
  SimulationRunModel,
  SimulationRunModelSchema,
} from '../simulation-run/simulation-run.model';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { HSDSClientModule } from '@biosimulations/hsds/client';
import { ConfigService } from '@nestjs/config';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';

@Module({
  imports: [
    BiosimulationsAuthModule,
    HSDSClientModule,
    MongooseModule.forFeature([
      { name: ResultsModel.name, schema: ResultsSchema },
      { name: SimulationRunModel.name, schema: SimulationRunModelSchema },
    ]),
    CacheModule.registerAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('cache.host'),
        port: configService.get('cache.port'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    ResultsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  controllers: [ResultsController],
})
export class ResultsModule {}
