import { forwardRef, Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModel, ProjectModelSchema } from './project.model';

import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';

import { HSDSClientModule } from '@biosimulations/simdata-api/nest-client-wrapper';

import { AccountManagementModule } from '@biosimulations/account/management';
import { SimulationRunModule } from '../simulation-run/simulation-run.module';
import { MetadataModule } from '../metadata/metadata.module';
import { LogsModule } from '../logs/logs.module';
import { FilesModule } from '../files/files.module';
import { SpecificationsModule } from '../specifications/specifications.module';

@Module({
  imports: [
    BiosimulationsAuthModule,
    SharedNatsClientModule,
    forwardRef(() => SimulationRunModule),
    LogsModule,
    MetadataModule,
    FilesModule,
    SpecificationsModule,
    AccountManagementModule,
    MongooseModule.forFeature([{ name: ProjectModel.name, schema: ProjectModelSchema }]),
    HSDSClientModule,
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule {}
