/**
 * @file Module file declares the controller for Simulation Runs and provides the service for accessing the database collection. Requires the Mongoose module to imported to the top level app.
 *       Also includes the feature module for the Simulation run and Simulation File models.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */

import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { Module } from '@nestjs/common';


import { MongooseModule } from '@nestjs/mongoose';
import { SimulationFile, SimulationFileSchema } from './file.model';
import { SimulationRunController } from './simulation-run.controller';
import {
  SimulationRunModel,
  SimulationRunModelSchema,
} from './simulation-run.model';
import { SimulationRunService } from './simulation-run.service';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
@Module({
  controllers: [SimulationRunController],
  imports: [
    BiosimulationsAuthModule,
    SharedNatsClientModule,
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
