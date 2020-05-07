import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';
import { SshService } from './services/ssh/ssh.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [HpcService, SbatchService, SshService],
})
export class AppModule {}
