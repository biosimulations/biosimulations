import { HttpModule, Module } from '@nestjs/common';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';

import { Configuration, DomainService } from '@biosimulations/hdf5apiclient';
import { ConfigService } from '@nestjs/config';
import { APIClientWrapperModule } from './api-client-wrapper.module';
import { SimulationHDFService } from './dataset.service';

@Module({
  imports: [
    HttpModule,
    BiosimulationsConfigModule,
    APIClientWrapperModule.registerAsync({
      imports: [BiosimulationsConfigModule],
      useFactory: {
        createHSDSConnectionOptions: (service: ConfigService) => {
          const username = service.get('data.username');
          const password = service.get('data.password');
          const basePath = service.get('data.basePath');
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
  providers: [SimulationHDFService, DomainService],
  exports: [SimulationHDFService],
})
export class HSDSClientModule {
  constructor() {}
}
