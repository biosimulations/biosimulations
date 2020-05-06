import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [HpcService, SbatchService],
})
export class AppModule {}
