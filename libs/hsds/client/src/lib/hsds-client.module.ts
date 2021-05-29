import {
  DynamicModule,
  HttpService,
  HttpModule,
  Module,
  Global,
} from '@nestjs/common';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';

import { ApiModule } from './api.module';
import { Configuration } from './configuration';

@Module({
  imports: [
    BiosimulationsConfigModule,
    ApiModule.forRoot(() => {
      return new Configuration({
        username: 'biosimulations',
        password: 'password',
        basePath: 'https://data.biosimulations.dev',
        withCredentials: true,
      });
    }),
  ],

  providers: [],
})
export class HSDSClientModule {}
