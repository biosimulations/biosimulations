import { Abstract, Global, Logger, Module, Type } from '@nestjs/common';
import { ApiModule, Configuration as SimdataAPIConfiguration } from '@biosimulations/simdata-api-nest-client';
import { ConfigService } from '@nestjs/config';
import { SimulationHDFService } from './dataset.service';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';
import { HttpModule } from '@nestjs/axios';
import { Endpoints } from '@biosimulations/config/common';

export { SimdataAPIConfiguration };

export type SimdataAPIConnectionOptionsFactory = (...args: any[]) => SimdataAPIConfiguration;

export interface SimdataAPIConnectionAsyncOptions {
  imports: any[];
  // eslint-disable-next-line @typescript-eslint/ban-types
  inject: (string | symbol | Function | Type<any> | Abstract<any>)[];
  useFactory: SimdataAPIConnectionOptionsFactory;
}

@Global()
@Module({
  imports: [
    HttpModule,
    BiosimulationsConfigModule,
    ApiModule.forRootAsync({
      imports: [BiosimulationsConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const env = configService.get('server.env');
        const endpoints = new Endpoints(env);
        const simdataBaseUrl = endpoints.getSimdataApiBaseUrl(false);
        const logger = new Logger(SimdataApiNestClientWrapperModule.name);
        logger.log(`Using Combine API: ${simdataBaseUrl}`);
        return new SimdataAPIConfiguration({
          basePath: simdataBaseUrl,
        });
      },
    }),
  ],
  controllers: [],
  providers: [SimulationHDFService],
  exports: [SimulationHDFService],
})
export class SimdataApiNestClientWrapperModule {
  constructor() {}
}
