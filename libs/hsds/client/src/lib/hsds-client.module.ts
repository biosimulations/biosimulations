import { HttpModule, Module, Logger } from '@nestjs/common';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';

import { Configuration, DomainService } from '@biosimulations/hdf5/api-client';
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
          const basePath = service.get('data.basePath');
          const username = service.get('data.username');
          const password = service.get('data.password');
          const withCredentials = service.get('data.withCredentials');

          const logger = new Logger(HSDSClientModule.name);
          logger.log(
            `Using HSDS client with HSDS configuration:`
            + `\n  basePath: ${basePath}`
            + `\n  username: ${username}`
            + `\n  password: ${password}`
          );

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
