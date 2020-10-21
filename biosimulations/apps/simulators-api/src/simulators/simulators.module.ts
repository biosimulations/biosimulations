import { Module } from '@nestjs/common';
import { SimulatorsController } from './simulators.controller';
import { SimulatorsService } from './simulators.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Simulator } from '@biosimulations/simulators/api-models';
import { SimulatorSchema } from '@biosimulations/simulators/database-models';
@Module({
  controllers: [SimulatorsController],
  providers: [SimulatorsService],
  imports: [
    MongooseModule.forFeature([
      { name: Simulator.name, schema: SimulatorSchema },
    ]),
  ],
})
export class SimulatorsModule {}
