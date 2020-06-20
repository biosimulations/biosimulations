import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import config from '../config/config';
import { Hpc } from './utils/hpc/hpc';
import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';
import { SshService } from './services/ssh/ssh.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: './config.env',
    }),
  ],
  controllers: [AppController],
  providers: [HpcService, SbatchService, SshService],
})
export class AppModule {}
