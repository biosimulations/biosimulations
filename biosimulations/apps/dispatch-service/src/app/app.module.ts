import { Module, HttpModule } from '@nestjs/common';

import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';
import { SshService } from './services/ssh/ssh.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { ScheduleModule } from '@nestjs/schedule';
import { ArchiverService } from './services/archiver/archiver.service';
import { SubmissionController } from './submission/submission.controller';

import { SubmissionService } from './submission/submission.service';

import { ResultsController } from './results/results.controller';
import { ResultsService } from './results/results.service';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import { AuthClientModule } from '@biosimulations/auth/client';
import { DispatchNestClientModule } from '@biosimulations/dispatch/nest-client';
import { ImagesModule } from '../images/images.module';
import { FileService } from './results/file.service';
import { LogService } from './results/log.service';
@Module({
  imports: [
    HttpModule,
    ImagesModule,
    BiosimulationsConfigModule,
    AuthClientModule,
    SharedNatsClientModule,
    DispatchNestClientModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [SubmissionController, ResultsController],
  providers: [
    HpcService,
    SbatchService,
    SshService,
    ArchiverService,
    SubmissionService,
    ResultsService,
    FileService,
    LogService,
  ],
})
export class AppModule {}
