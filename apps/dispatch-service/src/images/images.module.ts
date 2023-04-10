import { JobQueue, BullModuleOptions } from '@biosimulations/messages/messages';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { SbatchService } from '../app/services/sbatch/sbatch.service';
import { SshService } from '../app/services/ssh/ssh.service';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { RefreshProcessor } from './refresh.processor';

@Module({
  controllers: [ImagesController],
  imports: [
    BullModule.registerQueueAsync({
      name: JobQueue.refreshImages,
      ...BullModuleOptions,
    }),
  ],
  providers: [ImagesService, SshService, SbatchService, RefreshProcessor],
})
export class ImagesModule {}
