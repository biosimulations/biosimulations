import { HttpModule, Module } from '@nestjs/common';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';

import { Configuration } from '@biosimulations/hdf5/api-client';
import { ConfigService } from '@nestjs/config';
import { APIClientWrapperModule } from './api-client-wrapper.module';
import { SimulationHDFService } from './dataset.service';
import { Endpoints } from '@biosimulations/config/common';

@Module({
  imports: [
    HttpModule,
    BiosimulationsConfigModule,
    APIClientWrapperModule.registerAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: {
        createHSDSConnectionOptions: (service: ConfigService) => {
          const endpoints = new Endpoints();

          const basePath = endpoints.getHsdsBasePath();
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
