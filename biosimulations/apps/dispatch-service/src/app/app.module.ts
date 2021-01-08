import { Module, HttpModule } from '@nestjs/common';

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
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client'
import { AuthClientModule } from '@biosimulations/auth/client';
@Module({
  imports: [HttpModule, BiosimulationsConfigModule, AuthClientModule, SharedNatsClientModule, ScheduleModule.forRoot()],
  controllers: [SubmissionController, ResultsController],
  providers: [
    SimulationRunService,
    HpcService,
    SbatchService,
    SshService,
    ArchiverService,
    SubmissionService,
    ResultsService
  ]
})
export class AppModule { }
