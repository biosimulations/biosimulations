import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import serverConfig from './biosimulations-server-config';
import databaseConfig from './biosimulations-database-config';
import authConfig from './biosimulations-auth-config';
import hpcConfig from './biosimulations-hpc-config';
import natsConfig from './biosimulations-nats-config';
import emailConfig from './biosimulations-email.config';
import urlsConfig from './biosimulations-urls-config';
import storageConfig from './biosimulations-storage-config';
import queueConfig from './biosimulations-queue-config';
import dataConfig from './biosimulations-data-config';
import singularityConfig from './singularity-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        serverConfig,
        hpcConfig,
        natsConfig,
        emailConfig,
        urlsConfig,
        storageConfig,
        queueConfig,
        dataConfig,
        singularityConfig,
      ],
      envFilePath: [
        './shared/shared.env',
        './config/config.env',
        './secret/secret.env',
      ],
    }),
  ],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class BiosimulationsConfigModule {}
