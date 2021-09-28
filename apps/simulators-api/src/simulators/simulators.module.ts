import { Module } from '@nestjs/common';
import { SimulatorsController } from './simulators.controller';
import { SimulatorsService } from './simulators.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Simulator } from '@biosimulations/simulators/database-models';
import { SimulatorSchema } from '@biosimulations/simulators/database-models';

import {
  AuthTestModule,
  BiosimulationsAuthModule,
} from '@biosimulations/auth/nest';
@Module({
  controllers: [SimulatorsController],
  providers: [SimulatorsService],
  imports: [
    BiosimulationsAuthModule,
    AuthTestModule,
    MongooseModule.forFeature([
      { name: Simulator.name, schema: SimulatorSchema },
    ]),
  ],
})
export class SimulatorsModule {}
