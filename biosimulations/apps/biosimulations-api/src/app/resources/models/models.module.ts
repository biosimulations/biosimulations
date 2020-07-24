import { Module, CacheModule } from '@nestjs/common';
import { ModelsService } from './models.service';
import { ModelsController } from './models.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { Model } from './biomodel.model';
@Module({
  // TODO setup typegoose module to use specific collection
  imports: [TypegooseModule.forFeature([Model]), CacheModule.register()],
  providers: [ModelsService],
  controllers: [ModelsController],
  exports: [ModelsService],
})
export class ModelsModule {}
