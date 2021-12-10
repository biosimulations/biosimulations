/**
 * @file Module file declares the controller for simulation runs and provides the service for accessing the database collection.
 * Requires the Mongoose module to imported to the top level app.
 * Also includes the feature module for the Simulation run and Simulation File models.
 * @author Bilal Shaikh
 * @copyright BioSimulations Team, 2020
 * @license MIT
 */

import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { forwardRef, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { SimulationRunController } from './simulation-run.controller';
import {
  SimulationRunModel,
  SimulationRunModelSchema,
} from './simulation-run.model';
import { SimulationRunService } from './simulation-run.service';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';

import { HSDSClientModule } from '@biosimulations/hsds/client';

import { OntologyApiModule } from '@biosimulations/ontology/api';
import { ResultsModule } from '../results/results.module';
import { LogsModule } from '../logs/logs.module';
import { SpecificationsModule } from '../specifications/specifications.module';
import { FilesModule } from '../files/files.module';
import { MetadataModule } from '../metadata/metadata.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    BiosimulationsAuthModule,
    HttpModule,
    SharedNatsClientModule,
    ResultsModule,
    OntologyApiModule,
    LogsModule,
    SpecificationsModule,
    FilesModule,
    MetadataModule,
    forwardRef(() => ProjectsModule),
    MongooseModule.forFeature([
      { name: SimulationRunModel.name, schema: SimulationRunModelSchema },
    ]),
    // Need to provide hash keys to allow use on cluster.
    //See https://github.com/OptimalBits/bull/blob/develop/PATTERNS.md#redis-cluster
    BullModule.registerQueue({
      name: 'dispatch',
      prefix: '{dispatch}',
    }),
    HSDSClientModule,
  ],
  controllers: [SimulationRunController],
  providers: [SimulationRunService],
  exports: [SimulationRunService],
})
export class SimulationRunModule {}
