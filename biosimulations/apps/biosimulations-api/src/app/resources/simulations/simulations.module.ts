import { Module } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { SimulationsController } from './simulations.controller';

@Module({
  providers: [SimulationsService],
  controllers: [SimulationsController],
  exports: [SimulationsService],
})
export class SimulationsModule {}
