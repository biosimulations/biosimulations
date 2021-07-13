import { Module } from '@nestjs/common';
import { BioModelsService } from './bioModels.service';
import { BioModelsController } from './bioModels.controller';

@Module({
  providers: [BioModelsService],
  controllers: [BioModelsController],
})
export class BioModelsModule {}
