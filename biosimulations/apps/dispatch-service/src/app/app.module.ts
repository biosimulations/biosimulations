import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';
import { SshService } from './services/ssh/ssh.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import {
  ClientProxyFactory,
  Transport,
  NatsOptions,
  ClientProxy
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ArchiverService } from './services/archiver/archiver.service';

import { SubmissionController } from './submission/submission.controller';

import { AuthService } from './services/auth/auth.service';
import { SubmissionService } from './submission/submission.service';
import { SimulationRunService } from './simulation-run/simulation-run.service';
import { ResultsController } from './results/results.controller';
import { ResultsService } from './results/results.service';

@Module({
  imports: [HttpModule, BiosimulationsConfigModule, ScheduleModule.forRoot()],
  controllers: [SubmissionController, ResultsController],
  providers: [
    SimulationRunService,
    HpcService,
    SbatchService,
    SshService,
    ArchiverService,
    AuthService,
    SubmissionService,

    {
      provide: 'DISPATCH_MQ',
      useFactory: (configService: ConfigService): ClientProxy => {
        const natsServerConfig = configService.get('nats');
        const natsOptions: NatsOptions = {};
        natsOptions.transport = Transport.NATS;
        natsOptions.options = natsServerConfig;
        return ClientProxyFactory.create(natsOptions);
      },
      inject: [ConfigService]
    },

    ResultsService
  ]
})
export class AppModule {}
