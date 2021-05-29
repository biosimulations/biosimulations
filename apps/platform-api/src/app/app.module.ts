import { Module, CacheModule } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

import { ModelsModule } from './resources/models/models.module';

import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { TypegooseModule } from 'nestjs-typegoose';
import { MongooseModule } from '@nestjs/mongoose';

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
    MongooseModule.forRootAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri') || '',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    CacheModule.register(),
    ModelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
