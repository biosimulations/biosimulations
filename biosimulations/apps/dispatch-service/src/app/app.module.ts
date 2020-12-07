import { Module, CacheModule, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { HpcService } from './services/hpc/hpc.service';
import { SbatchService } from './services/sbatch/sbatch.service';
import { SshService } from './services/ssh/ssh.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import {
  ClientProxyFactory,
  Transport,
  NatsOptions,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ArchiverService } from './services/archiver/archiver.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelsModule } from './resources/models/models.module';
import { SimulationService } from './services/simulation/simulation.service';
import { SubmissionController } from './submission.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    HttpModule,
    BiosimulationsConfigModule,
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri') || '',
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    TypegooseModule.forRootAsync({
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
  controllers: [AppController, SubmissionController],
  providers: [
    AppService,
    HpcService,
    SbatchService,
    SshService,
    ArchiverService,
    SimulationService,
    {
      provide: 'DISPATCH_MQ',
      useFactory: (configService: ConfigService) => {
        const natsServerConfig = configService.get('nats');
        const natsOptions: NatsOptions = {};
        natsOptions.transport = Transport.NATS;
        natsOptions.options = natsServerConfig;
        return ClientProxyFactory.create(natsOptions);
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule { }
