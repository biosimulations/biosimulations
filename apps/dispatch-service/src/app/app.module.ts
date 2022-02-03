import { Logger, Module } from '@nestjs/common';
import { BullModule } from '@ejhayes/nestjs-bullmq';
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
import { DispatchProcessor } from './submission/dispatch.processor';
import { CompleteProcessor } from './submission/complete.processor';
import { MonitorProcessor } from './submission/monitor.processor';
import { SimulationStatusService } from './services/simulationStatus.service';

import {
  CombineApiNestClientWrapperModule,
  CombineAPIConfiguration,
} from '@biosimulations/combine-api-nest-client-wrapper';
import { JobQueue } from '@biosimulations/messages/messages';
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
import { QueueScheduler } from 'bullmq';
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

const bullModuleOptions = {
  useFactory: async (configService: ConfigService) => ({
    connection: {
      host: configService.get('queue.host'),
      port: configService.get('queue.port'),
    },
  }),
  inject: [ConfigService],
};
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
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('queue.host'),
          port: configService.get('queue.port'),
        },
      }),
      inject: [ConfigService],
    }),
    // Need to provide hash keys to allow use on cluster.
    //See https://github.com/OptimalBits/bull/blob/develop/PATTERNS.md#redis-cluster
    BullModule.registerQueueAsync(
      {
        name: JobQueue.dispatch,
        useFactory: async (configService: ConfigService) => ({
          connection: {
            host: configService.get('queue.host'),
            port: configService.get('queue.port'),
          },
          defaultJobOptions: {
            removeOnComplete: true,
            attempts: 10,
            backoff: { type: 'exponential', delay: 1000 },
          },
        }),
        inject: [ConfigService],
      },
      {
        name: JobQueue.complete,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.monitor,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.extract,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.process,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.files,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.thumbnailProcess,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.thumbnailPost,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.sedmlProcess,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.sedmlPost,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.logs,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.logsPost,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.manifest,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.output,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.metadata,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.metadataPost,
        ...bullModuleOptions,
      },
      {
        name: JobQueue.publish,
        ...bullModuleOptions,
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

    // Processors
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
  public constructor(private configService: ConfigService) {
    // TODO maybe move all the queue schedulers to their own app/docker container
    // Each replica of the container will add load to redis. only one scheduler is needed across the whole deployment
    const connection = {
      host: configService.get('queue.host'),
      port: configService.get('queue.port'),
    };

    const scheduler = new QueueScheduler(JobQueue.dispatch, {
      connection,
    });

    const completescheduler = new QueueScheduler(JobQueue.complete, {
      connection,
    });
    const extractscheduler = new QueueScheduler(JobQueue.extract, {
      connection,
    });
    const filesscheduler = new QueueScheduler(JobQueue.files, {
      connection,
    });
    const metadatascheduler = new QueueScheduler(JobQueue.metadata, {
      connection,
    });
    const metadataPostscheduler = new QueueScheduler(JobQueue.metadataPost, {
      connection,
    });

    const logsScheduler = new QueueScheduler(JobQueue.logs, { connection });
    const logsPostScheduler = new QueueScheduler(JobQueue.logsPost, {
      connection,
    });

    const manifestsScheduler = new QueueScheduler(JobQueue.manifest, {
      connection,
    });

    const outputsScheduler = new QueueScheduler(JobQueue.output, {
      connection,
    });
    const thumbnailProcessScheduler = new QueueScheduler(
      JobQueue.thumbnailProcess,
      { connection },
    );
    const thumbnailPostScheduler = new QueueScheduler(JobQueue.thumbnailPost, {
      connection,
    });
    const sedmlProcessScheduler = new QueueScheduler(JobQueue.sedmlProcess, {
      connection,
    });
    const sedmlPostScheduler = new QueueScheduler(JobQueue.sedmlPost, {
      connection,
    });

    const monitorScheduler = new QueueScheduler(JobQueue.monitor, {
      connection,
    });
  }
}
