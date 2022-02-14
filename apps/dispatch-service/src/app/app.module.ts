import { Logger, Module } from '@nestjs/common';
import { BullModule } from '@biosimulations/nestjs-bullmq';
import { HttpModule } from '@nestjs/axios';
import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';
import { SshService } from './services/ssh/ssh.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { ArchiverService } from './results/archiver.service';

import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import { AuthClientModule } from '@biosimulations/auth/client';
import { DispatchNestClientModule } from '@biosimulations/api-nest-client';
import { ImagesModule } from '../images/images.module';

import { LogService } from './results/log.service';

import { ConfigService } from '@nestjs/config';
import { ResolveCombineArchiveProcessor } from './submission/resolveCombineArchive.processor';
import { DispatchProcessor } from './submission/dispatch.processor';
import { CompleteProcessor } from './submission/complete.processor';
import { MonitorProcessor } from './submission/monitor.processor';
import { SimulationStatusService } from './services/simulationStatus.service';

import {
  CombineApiNestClientWrapperModule,
  CombineAPIConfiguration,
} from '@biosimulations/combine-api-nest-client-wrapper';
import { JobQueue, BullModuleOptions } from '@biosimulations/messages/messages';
import { MetadataService } from '../metadata/metadata.service';
import { CombineWrapperService } from '../combineWrapper.service';
import { FileService } from '../file/file.service';
import { SedmlService } from '../sedml/sedml.service';
import { ProjectService } from '@biosimulations/api-nest-client';
import { Endpoints } from '@biosimulations/config/common';
import { SharedStorageModule } from '@biosimulations/shared/storage';
import { ThumbnailService } from '../thumbnail/thumbnail.service';
import { ManifestService } from '../manifest/manifest.service';
import { ExtractionService } from '../extraction/extraction.service';
import { ExtractProcessor } from './submission/extract.processor';
import { ProcessProcessor } from './submission/process.processor';
import { FilesProcessor } from './submission/files.proccessor';
import { ThumbnailsProcessor } from './submission/thumbnails.proccessor';
import { SedMLProcessor } from './submission/sedML.processor';
import { LogProcessor } from './submission/log.processor';
import { ManifestProcessor } from './submission/manifest.processor';
import { OutputProcessor } from './submission/output.processor';
import { MetadataProcessor } from './submission/metadata.processor';
import { ThumbnailsPostProcessor } from './submission/thumbnailsPost.processor';
import { SedMLPostProcessor } from './submission/sedmlPost.processor';
import { MetadataPostProcessor } from './submission/metadataPost.processor';
import { LogsPostProcessor } from './submission/logPost.processor';
import { PublishProcessor } from './submission/publish.processor';
import { AppQueueManagerProvider } from './app.queues.provider';
import { CleanUpProcessor } from './submission/cleanup.processor';
import { SubmissionProcessor } from './submission/submit.processor';

@Module({
  imports: [
    HttpModule,
    ImagesModule,
    BiosimulationsConfigModule,
    AuthClientModule,
    SharedNatsClientModule,
    DispatchNestClientModule,
    CombineApiNestClientWrapperModule.forRootAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: (configService: ConfigService) => {
        const env = configService.get('server.env');
        const endpoints = new Endpoints(env);
        const combineBaseUrl = endpoints.getCombineApiBaseUrl(false);
        const logger = new Logger(AppModule.name);
        logger.log(`Using Combine API: ${combineBaseUrl}`);
        return new CombineAPIConfiguration({
          basePath: combineBaseUrl,
        });
      },
      inject: [ConfigService],
    }),

    BullModule.forRootAsync({
      ...BullModuleOptions,
    }),
    // Need to provide hash keys to allow use on cluster.
    //See https://github.com/OptimalBits/bull/blob/develop/PATTERNS.md#redis-cluster
    BullModule.registerQueueAsync(
      {
        name: JobQueue.submitSimulationRun,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.resolveCombineArchive,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.dispatch,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.complete,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.monitor,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.extract,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.process,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.files,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.thumbnailProcess,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.thumbnailPost,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.sedmlProcess,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.sedmlPost,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.logs,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.logsPost,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.manifest,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.output,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.metadata,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.metadataPost,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.publish,
        ...BullModuleOptions,
      },
      {
        name: JobQueue.clean,
        ...BullModuleOptions,
      },
    ),

    SharedStorageModule,
  ],
  controllers: [],
  providers: [
    HpcService,
    SbatchService,
    SshService,
    ArchiverService,
    LogService,
    AppQueueManagerProvider,
    // Processors
    ResolveCombineArchiveProcessor,
    DispatchProcessor,
    MonitorProcessor,
    ProcessProcessor,
    ExtractProcessor,
    ManifestProcessor,
    FilesProcessor,
    ThumbnailsProcessor,
    ThumbnailsPostProcessor,
    OutputProcessor,
    SedMLProcessor,
    SedMLPostProcessor,
    LogProcessor,
    MetadataProcessor,
    MetadataPostProcessor,
    LogsPostProcessor,
    CompleteProcessor,
    PublishProcessor,
    CleanUpProcessor,
    SubmissionProcessor,

    // Services
    MetadataService,
    SimulationStatusService,
    CombineWrapperService,
    FileService,
    SedmlService,
    ProjectService,
    ThumbnailService,
    ManifestService,
    ExtractionService,
  ],
})
export class AppModule {
  public constructor(private configService: ConfigService) {}
}
