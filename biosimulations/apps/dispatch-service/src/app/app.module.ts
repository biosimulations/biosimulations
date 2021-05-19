import { Module, HttpModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';
import { SshService } from './services/ssh/ssh.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { ScheduleModule } from '@nestjs/schedule';
import { ArchiverService } from './results/archiver.service';

import { ResultsService } from './results/results.service';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import { AuthClientModule } from '@biosimulations/auth/client';
import { DispatchNestClientModule } from '@biosimulations/dispatch/nest-client';
import { ImagesModule } from '../images/images.module';
import { FileService } from './results/file.service';
import { LogService } from './results/log.service';

import { ConfigService } from '@nestjs/config';
import { DispatchProcessor } from './submission/dispatch.proccessor';
import { FailProcessor } from './submission/fail.processor';
import { CompleteProccessor } from './submission/complete.proccessor';
import { MonitorProcessor } from './submission/monitor.processor';
import { SimulationStatusService } from './services/simulationStatus.service';

@Module({
  imports: [
    HttpModule,
    ImagesModule,
    BiosimulationsConfigModule,
    AuthClientModule,
    SharedNatsClientModule,
    DispatchNestClientModule,
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => {
        console.log(configService.get('queue.host'));
        console.log(configService.get('queue.port'));
        return {
          redis: {
            host: configService.get('queue.host'),
            port: configService.get('queue.port'),
          },
        };
      },
      inject: [ConfigService],
    }),
    // Need to provide hash keys to allow use on cluster.
    //See https://github.com/OptimalBits/bull/blob/develop/PATTERNS.md#redis-cluster
    BullModule.registerQueue({
      name: 'dispatch',
      prefix: '{dispatch}',
    }),
    BullModule.registerQueue({
      name: 'monitor',
      prefix: '{monitor}',
    }),
    BullModule.registerQueue({
      name: 'complete',
      prefix: '{complete}',
    }),

    BullModule.registerQueue({
      name: 'fail',
      prefix: '{fail}',
    }),
  ],
  controllers: [],
  providers: [
    HpcService,
    SbatchService,
    SshService,
    ArchiverService,
    ResultsService,
    FileService,
    LogService,
    DispatchProcessor,
    FailProcessor,
    CompleteProccessor,
    MonitorProcessor,
    SimulationStatusService,
  ],
})
export class AppModule {}
