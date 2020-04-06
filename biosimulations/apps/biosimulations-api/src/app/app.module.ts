import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import config from '../config/config';
import { ModelsController } from './resources/models/models.controller';
import { SimulationsController } from './resources/simulations/simulations.controller';
import { VisualizationsController } from './resources/visualizations/visualizations.controller';
import { ChartsController } from './resources/charts/charts.controller';
import { ProjectsController } from './resources/projects/projects.controller';
import { ModelsModule } from './resources/models/models.module';
import { ModelsService } from './resources/models/models.service';
import { ProjectsModule } from './resources/projects/projects.module';
import { SimulationsModule } from './resources/simulations/simulations.module';
import { VisualizationsModule } from './resources/visualizations/visualizations.module';
import { ChartsModule } from './resources/charts/charts.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: './config.env',
    }),
    ModelsModule,
    ProjectsModule,
    SimulationsModule,
    ChartsModule,
    VisualizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
