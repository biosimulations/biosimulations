import { Module, CacheModule } from '@nestjs/common';
import { ModelsService } from './models.service';

import { TypegooseModule } from 'nestjs-typegoose';
import { DispatchSimulationModelDB } from '@biosimulations/dispatch/api-models';
@Module({
  imports: [
    TypegooseModule.forFeature([DispatchSimulationModelDB]),
    CacheModule.register(),
  ],
  providers: [ModelsService],

  exports: [ModelsService],
})
export class ModelsModule {}
