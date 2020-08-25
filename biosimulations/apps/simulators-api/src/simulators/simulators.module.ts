import { Module } from '@nestjs/common';
import { SimulatorsController } from './simulators.controller';
import { SimulatorsService } from './simulators/simulators.service';

@Module({
  controllers: [SimulatorsController],
  providers: [SimulatorsService]
})
export class SimulatorsModule {}
