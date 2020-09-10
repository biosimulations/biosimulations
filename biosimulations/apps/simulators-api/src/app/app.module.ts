import { Module } from '@nestjs/common';

import { BiosimulationsConfigModule } from '@biosimulations/config/nest';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { SimulatorsService } from '../simulators/simulators.service';
import { SimulatorsController } from '../simulators/simulators.controller';
import { SimulatorsModule } from '../simulators/simulators.module';
import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
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
  ],
})
export class AppModule {}
