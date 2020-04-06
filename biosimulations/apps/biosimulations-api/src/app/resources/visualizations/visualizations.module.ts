import { Module } from '@nestjs/common';
import { VisualizationsController } from './visualizations.controller';
import { VisualizationsService } from './visualizations.service';

@Module({
  controllers: [VisualizationsController],
  providers: [VisualizationsService]
})
export class VisualizationsModule {}
