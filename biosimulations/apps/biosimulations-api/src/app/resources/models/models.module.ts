import { Module } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { BiomodelDB } from './biomodel.model';
@Module({
  imports: [TypegooseModule.forFeature([BiomodelDB])],
  providers: [ModelsService],
  controllers: [ModelsController],
  exports: [ModelsService],
})
export class ModelsModule {}
