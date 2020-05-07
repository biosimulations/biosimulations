import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import config from '../config/config';
import { Hpc } from './utils/hpc/hpc';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: './config.env',
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
