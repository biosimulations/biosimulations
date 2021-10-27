import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModel, ProjectModelSchema } from './project.model';

import { SimulationRunService } from '../simulation-run/simulation-run.service';
import {
  SimulationRunModel,
  SimulationRunModelSchema,
} from '../simulation-run/simulation-run.model';
import { SimulationFile, SimulationFileSchema } from '../simulation-run/file.model';
import { HttpModule } from '@nestjs/axios';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';

import { FilesService } from '../files/files.service';
import { FileModel, FileModelSchema } from '../files/files.model';

import { SpecificationsService } from '../specifications/specifications.service';
import {
  SpecificationsModel,
  SpecificationsModelSchema,
} from '../specifications/specifications.model';

import { LogsService } from '../logs/logs.service';
import {
  SimulationRunLog,
  SimulationRunLogSchema,
  CombineArchiveLog,
  CombineArchiveLogSchema,
} from '../logs/logs.model';

import { ResultsService } from '../results/results.service';
import { HSDSClientModule } from '@biosimulations/hsds/client';

import { MetadataService } from '../metadata/metadata.service';
import { SimulationRunMetadataModel, SimulationRunMetadataSchema } from '../metadata/metadata.model';

@Module({
  imports: [
    BiosimulationsAuthModule,
    HttpModule,
    SharedNatsClientModule,
    MongooseModule.forFeature([
      { name: SimulationRunModel.name, schema: SimulationRunModelSchema },
      { name: ProjectModel.name, schema: ProjectModelSchema },
      {
        name: SimulationFile.name,
        schema: SimulationFileSchema,
      },
      {
        name: SimulationRunMetadataModel.name,
        schema: SimulationRunMetadataSchema,
      },
      { 
        name: FileModel.name,
        schema: FileModelSchema
      },
      { 
        name: SpecificationsModel.name,
        schema: SpecificationsModelSchema,
      },
      {
        name: SimulationRunLog.name,
        schema: SimulationRunLogSchema,
      },
      {
        name: CombineArchiveLog.name,
        schema: CombineArchiveLogSchema,
      },
    ]),
    HSDSClientModule,
  ],
  providers: [
    ProjectsService,
    SimulationRunService,
    FilesService,
    SpecificationsService,
    LogsService,
    ResultsService,
    MetadataService,
  ],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
