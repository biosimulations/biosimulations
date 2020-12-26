/**
 * @file Module file declares the controller for Simulation Runs and provides the service for accessing the database collection. Requires the Mongoose module to imported to the top level app.
 *       Also includes the feature module for the Simulation run and Simulation File models.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */

import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Transport,
  ClientProxyFactory,
  NatsOptions
} from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { SimulationFile, SimulationFileSchema } from './file.model';
import { SimulationRunController } from './simulation-run.controller';
import {
  SimulationRunModel,
  SimulationRunModelSchema,
} from './simulation-run.model';
import { SimulationRunService } from './simulation-run.service';

@Module({
  controllers: [SimulationRunController],
  imports: [
    BiosimulationsAuthModule,
    MongooseModule.forFeature([
      { name: SimulationRunModel.name, schema: SimulationRunModelSchema },
      {
        name: SimulationFile.name,
        schema: SimulationFileSchema,
      },
    ]),
    
  ],
  providers: [
    SimulationRunService,
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
export class SimulationRunModule {}
