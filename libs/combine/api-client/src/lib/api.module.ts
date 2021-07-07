import {
  DynamicModule,
  HttpService,
  HttpModule,
  Module,
  Global,
} from '@nestjs/common';
import { Configuration } from './configuration';

import { COMBINEService } from './api/cOMBINE.service';
import { KiSAOService } from './api/kiSAO.service';
import { SEDMLService } from './api/sEDML.service';

@Global()
@Module({
  imports: [HttpModule],
  exports: [COMBINEService, KiSAOService, SEDMLService],
  providers: [COMBINEService, KiSAOService, SEDMLService],
})
export class ApiModule {
  public static forRoot(
    configurationFactory: () => Configuration,
  ): DynamicModule {
    return {
      module: ApiModule,
      providers: [{ provide: Configuration, useFactory: configurationFactory }],
    };
  }

  constructor(httpService: HttpService) {}
}
