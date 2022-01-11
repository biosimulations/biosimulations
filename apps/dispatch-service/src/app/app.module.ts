import { Logger, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';
import { SshService } from './services/ssh/ssh.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { ScheduleModule } from '@nestjs/schedule';
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
import { SimulationResultsService } from '../simulation-results/simulation-results.service';
import { ProjectService } from '@biosimulations/api-nest-client';
import { Endpoints } from '@biosimulations/config/common';
import { SharedStorageModule } from '@biosimulations/shared/storage';

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
        const logger = new Logger('loading');
        logger.error(combineBaseUrl);
        return new CombineAPIConfiguration({
          basePath: combineBaseUrl,
        });
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('queue.host'),
          port: configService.get('queue.port'),
        },
      }),
      inject: [ConfigService],
    }),
    // Need to provide hash keys to allow use on cluster.
    //See https://github.com/OptimalBits/bull/blob/develop/PATTERNS.md#redis-cluster
    BullModule.registerQueue({
      name: JobQueue.dispatch,
      prefix: '{dispatch}',
    }),
    BullModule.registerQueue({
      name: JobQueue.monitor,
      prefix: '{monitor}',
    }),
    BullModule.registerQueue({
      name: JobQueue.complete,
      prefix: '{complete}',
    }),
    BullModule.registerQueue({
      name: JobQueue.health,
      prefix: '{health}',
    }),
    SharedStorageModule,
  ],
  controllers: [],
  providers: [
    HpcService,
    SbatchService,
    SshService,
    ArchiverService,
    LogService,
    DispatchProcessor,
    CompleteProcessor,
    MonitorProcessor,
    MetadataService,
    SimulationStatusService,
    CombineWrapperService,
    FileService,
    SedmlService,
    SimulationResultsService,
    ProjectService,
  ],
})
export class AppModule {}
