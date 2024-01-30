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
import { BullModule } from '@nestjs/bullmq';
import { SimulationRunController } from './simulation-run.controller';
import { SimulationRunModel, SimulationRunModelSchema } from './simulation-run.model';
import { SimulationRunService } from './simulation-run.service';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';

import { SimdataApiNestClientWrapperModule } from '@biosimulations/simdata-api/nest-client-wrapper';

import { OntologyApiModule } from '@biosimulations/ontology/api';
import { ResultsModule } from '../results/results.module';
import { LogsModule } from '../logs/logs.module';
import { SpecificationsModule } from '../specifications/specifications.module';
import { FilesModule } from '../files/files.module';
import { MetadataModule } from '../metadata/metadata.module';
import { ProjectsModule } from '../projects/projects.module';
import { SimulationRunValidationService } from './simulation-run-validation.service';
import { BullModuleOptions, JobQueue } from '@biosimulations/messages/messages';

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
    MongooseModule.forFeature([{ name: SimulationRunModel.name, schema: SimulationRunModelSchema }]),
    BullModule.registerQueue({
      name: JobQueue.submitSimulationRun,
      ...BullModuleOptions,
    }),
    SimdataApiNestClientWrapperModule,
  ],
  controllers: [SimulationRunController],
  providers: [SimulationRunService, SimulationRunValidationService],
  exports: [SimulationRunService, SimulationRunValidationService],
})
export class SimulationRunModule {}
