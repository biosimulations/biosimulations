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

import { MetadataService } from '../metadata/metadata.service';
import { SimulationRunMetadataModel, SimulationRunMetadataSchema } from '../metadata/metadata.model';

/*
import { SimulationProjectsService as MetadataErrorService } from '@biosimulations/combine-api-client';
import {
  ApiModule as CombineApiModule,
  Configuration as combineConfig,
} from '@biosimulations/combine-api-client';
*/

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
    ]),
    // CombineApiModule.forRoot(() => new combineConfig({})),
  ],
  providers: [
    ProjectsService,
    SimulationRunService,
    MetadataService,
    // MetadataErrorService,
  ],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
