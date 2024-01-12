import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';

import { Configuration } from '@biosimulations/hdf5/api-client';
import { ConfigService } from '@nestjs/config';
import { APIClientWrapperModule } from './api-client-wrapper.module';
import { SimulationHDFService } from './dataset.service';
import { ApiModule } from '@biosimulations/simdata-api-nest-client';

@Module({
  imports: [
    HttpModule,
    BiosimulationsConfigModule,
    ApiModule,
    APIClientWrapperModule.registerAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: {
        createHSDSConnectionOptions: (service: ConfigService) => {
          const basePath = service.get('data.basePath');
          const username = service.get('data.username');
          const password = service.get('data.password');
          const withCredentials = service.get('data.withCredentials');

          return new Configuration({
            username,
            password,
            basePath,
            withCredentials,
          });
        },
      },
      inject: [ConfigService],
    }),
  ],
  providers: [SimulationHDFService],
  exports: [SimulationHDFService],
})
export class HSDSClientModule {
  constructor() {}
}

export * from './data-paths/data-paths';
