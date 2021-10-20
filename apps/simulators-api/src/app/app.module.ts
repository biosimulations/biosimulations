import { Module } from '@nestjs/common';

import { BiosimulationsConfigModule } from '@biosimulations/config/nest';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { SimulatorsModule } from '../simulators/simulators.module';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { SharedExceptionsFiltersModule } from '@biosimulations/shared/exceptions/filters';
import * as mongoose from 'mongoose';
import { HealthModule } from '../health/health.module';
mongoose.set('strict', 'throw');
@Module({
  imports: [
    BiosimulationsConfigModule,
    BiosimulationsAuthModule,
    MongooseModule.forRootAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri') || '',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    SimulatorsModule,
    SharedExceptionsFiltersModule,
    HealthModule,
  ],
})
export class AppModule {}
