import { Module, Global } from '@nestjs/common';
import { SharedStorageService } from './shared-storage.service';
import { S3Module } from 'nestjs-s3';
import { ConfigService } from '@nestjs/config';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { TestController } from './share-storage.controller';

@Global()
@Module({
  controllers: [TestController],
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
        },
      }),
    }),
  ],
  providers: [SharedStorageService],
  exports: [SharedStorageService],
})
export class SharedStorageModule {}
