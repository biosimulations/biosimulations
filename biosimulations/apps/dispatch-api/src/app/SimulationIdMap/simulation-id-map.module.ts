import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SimulationIdMapController } from './simulation-id-map.controller';
import { SimulationIdMapService } from './simulation-id-map.service';
import {
  SimulationIdMap,
  SimulationIdMapSchema,
} from './schemas/simulation-id-map.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: SimulationIdMap.name, schema: SimulationIdMapSchema }],
      'projectname'
    ),
  ],
  controllers: [SimulationIdMapController],
  providers: [SimulationIdMapService],
})
export class SimulationIdMapModule {}
