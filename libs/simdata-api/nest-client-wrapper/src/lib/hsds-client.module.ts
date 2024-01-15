import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BiosimulationsConfigModule } from '@biosimulations/config/nest';

import { SimulationHDFService } from './dataset.service';
import { ApiModule } from '@biosimulations/simdata-api-nest-client';

@Module({
  imports: [HttpModule, BiosimulationsConfigModule, ApiModule],
  providers: [SimulationHDFService],
  exports: [SimulationHDFService],
})
export class HSDSClientModule {
  constructor() {}
}

export * from './data-paths/data-paths';
