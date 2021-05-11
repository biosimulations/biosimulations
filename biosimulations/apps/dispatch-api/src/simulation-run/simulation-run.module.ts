/**
 * @file Module file declares the controller for simulation runs and provides the service for accessing the database collection. Requires the Mongoose module to imported to the top level app.
 *       Also includes the feature module for the Simulation run and Simulation File models.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */

import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { HttpModule, Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { SimulationFile, SimulationFileSchema } from './file.model';
import { SimulationRunController } from './simulation-run.controller';
import {
  SimulationRunModel,
  SimulationRunModelSchema,
} from './simulation-run.model';
import { SimulationRunService } from './simulation-run.service';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import { SharedExceptionsFiltersModule } from '@biosimulations/shared/exceptions/filters';
@Module({
  controllers: [SimulationRunController],
  imports: [
    BiosimulationsAuthModule,
    SharedExceptionsFiltersModule,
    SharedNatsClientModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: SimulationRunModel.name, schema: SimulationRunModelSchema },
      {
        name: SimulationFile.name,
        schema: SimulationFileSchema,
      },
    ]),
  ],
  providers: [SimulationRunService],
})
export class SimulationRunModule {}
