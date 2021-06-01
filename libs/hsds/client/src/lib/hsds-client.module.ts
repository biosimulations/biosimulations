import { Module } from '@nestjs/common';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';

import { ApiModule, Configuration } from '@biosimulations/hdf5apiclient';

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
