import { HttpModule, HttpService, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SimulationRunService } from './simulation-run.service';

@Module({
  controllers: [],
  imports: [HttpModule],
  providers: [SimulationRunService, AuthService],
  exports: [SimulationRunService, AuthService],
})
export class DispatchNestClientModule { }
