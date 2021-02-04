import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigService } from '@nestjs/config';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { SimulationRunModule } from '../simulation-run/simulation-run.module';
import { SharedExceptionsFiltersModule } from '@biosimulations/shared/exceptions/filters';
import { ResultsModule } from '../results/results.module';
import { SharedNatsClientModule } from '@biosimulations/shared/nats-client';
import {
  AuthTestModule,
  BiosimulationsAuthModule,
} from '@biosimulations/auth/nest';
import { ImagesModule } from '../images/images.module';
import { LogsModule } from '../logs/logs.module';
import { SharedStorageModule } from '@biosimulations/shared/storage';
@Module({
  imports: [
    BiosimulationsConfigModule,
    BiosimulationsAuthModule,
    ImagesModule,
    HttpModule,
    LogsModule,
    MongooseModule.forRootAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri') || '',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    SimulationRunModule,
    ResultsModule,
    SharedExceptionsFiltersModule,
    AuthTestModule,
    SharedNatsClientModule,
    SharedStorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
