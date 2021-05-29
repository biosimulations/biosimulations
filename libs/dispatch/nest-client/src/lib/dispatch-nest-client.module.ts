import { AuthClientModule } from '@biosimulations/auth/client';
import { HttpModule, Module } from '@nestjs/common';
import { SimulationRunService } from './simulation-run.service';

@Module({
  controllers: [],
  imports: [HttpModule, AuthClientModule],
  providers: [SimulationRunService],
  exports: [SimulationRunService],
})
export class DispatchNestClientModule {}
