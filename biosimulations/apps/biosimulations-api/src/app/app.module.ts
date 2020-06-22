import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ModelsModule } from './resources/models/models.module';

import { BiosimulationsConfigModule } from '@biosimulations/shared/biosimulations-config';
import { BiosimulationsAuthModule } from '@biosimulations/shared/biosimulations-auth';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    BiosimulationsConfigModule,
    BiosimulationsAuthModule,
    TypegooseModule.forRootAsync({
      // This line is not needed since config module is global. will be needed if used in another app after abstraction
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri') || '',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),

    ModelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
