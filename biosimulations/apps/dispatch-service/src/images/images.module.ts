import { Module } from '@nestjs/common';
import { SbatchService } from '../app/services/sbatch/sbatch.service';
import { SshService } from '../app/services/ssh/ssh.service';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  controllers: [ImagesController],
  providers: [ImagesService, SshService, SbatchService]
})
export class ImagesModule { }
