import { Module } from '@nestjs/common';
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
import { DispatchProcessor } from './submission/dispatch.proccessor';
import { FailProcessor } from './submission/fail.processor';
import { CompleteProccessor } from './submission/complete.proccessor';
import { MonitorProcessor } from './submission/monitor.processor';
import { SimulationStatusService } from './services/simulationStatus.service';

import {
  ApiModule as CombineApiModule,
  Configuration as combineConfig,
} from '@biosimulations/combine-api-client';
import { JobQueue } from '@biosimulations/messages/messages';
import { MetadataService } from '../metadata/metadata.service';
import { CombineWrapperService } from '../combineWrapper.service';
import { FileService } from '../file/file.service';
import { SedmlService } from '../sedml/sedml.service';
@Module({
  imports: [
    HttpModule,
    ImagesModule,
    BiosimulationsConfigModule,
    AuthClientModule,
    SharedNatsClientModule,
    DispatchNestClientModule,
    CombineApiModule.forRoot(() => new combineConfig({})),
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
      name: JobQueue.fail,
      prefix: '{fail}',
    }),
    BullModule.registerQueue({
      name: JobQueue.health,
      prefix: '{health}',
    }),
  ],
  controllers: [],
  providers: [
    HpcService,
    SbatchService,
    SshService,
    ArchiverService,
    LogService,
    DispatchProcessor,
    FailProcessor,
    CompleteProccessor,
    MonitorProcessor,
    MetadataService,
    SimulationStatusService,
    CombineWrapperService,
    FileService,
    SedmlService,
  ],
})
export class AppModule {}
