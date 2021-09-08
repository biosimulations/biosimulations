import { Module, Global } from '@nestjs/common';
import { SharedStorageService } from './shared-storage.service';
import { S3Module } from 'nestjs-s3';
import { ConfigService } from '@nestjs/config';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';

import * as https from 'https';
import { SimulationStorageService } from './simulation-storage.service';
@Global()
@Module({
  controllers: [],
  imports: [
    S3Module.forRootAsync({
      imports: [BiosimulationsConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        config: {
          credentials: {
            accessKeyId: configService.get('storage.accessKey') || '',
            secretAccessKey: configService.get('storage.secret') || '',
          },
          endpoint: configService.get('storage.endpoint'),
          s3ForcePathStyle: true,
          region: 'us-east-1',
          httpOptions: {
            agent: new https.Agent({
              rejectUnauthorized: false,
            }),
          },
        },
      }),
    }),
  ],
  providers: [SharedStorageService, SimulationStorageService],
  exports: [SharedStorageService, SimulationStorageService],
})
export class SharedStorageModule {}
