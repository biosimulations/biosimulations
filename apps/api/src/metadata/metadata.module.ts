import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { MetadataController } from './metadata.controller';
import {
  SimulationRunMetadataModel,
  SimulationRunMetadataSchema,
} from './metadata.model';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SimulationRunModel,
  SimulationRunModelSchema,
} from '../simulation-run/simulation-run.model';

@Module({
  providers: [MetadataService],
  controllers: [MetadataController],
  imports: [
    MongooseModule.forFeature([
      {
        name: SimulationRunMetadataModel.name,
        schema: SimulationRunMetadataSchema,
      },
      { name: SimulationRunModel.name, schema: SimulationRunModelSchema },
    ]),
  ],
})
export class MetadataModule {}
