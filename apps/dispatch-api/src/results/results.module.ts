/**
 * @file Module that declares the results controller for the api, the service that implements the controller methods, and the mongoose models. Requires the Mongoose root module to be availalble in the application.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { Module } from '@nestjs/common';
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
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BiosimulationsAuthModule,
    HSDSClientModule.registerAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: {
        createHSDSConnectionOptions: (service: ConfigService) => {
          const username = service.get('user');
          const password = service.get('user');
          const basePath = service.get('user');
          const withCredentials = service.get('user');
          return { username, password, basePath, withCredentials };
        },
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: ResultsModel.name, schema: ResultsSchema },
      { name: SimulationRunModel.name, schema: SimulationRunModelSchema },
    ]),
  ],
  providers: [ResultsService],
  controllers: [ResultsController],
})
export class ResultsModule {}
