import { AuthClientModule } from '@biosimulations/auth/client';
import { Module } from '@nestjs/common';
import { SimulationRunService } from './simulation-run.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  controllers: [],
  imports: [HttpModule, AuthClientModule],
  providers: [SimulationRunService],
  exports: [SimulationRunService],
})
export class DispatchNestClientModule {}
