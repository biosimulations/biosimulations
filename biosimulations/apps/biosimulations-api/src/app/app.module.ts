import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config/config';
import { ModelsModule } from './resources/models/models.module';
import { ProjectsModule } from './resources/projects/projects.module';
import { SimulationsModule } from './resources/simulations/simulations.module';
import { VisualizationsModule } from './resources/visualizations/visualizations.module';
import { ChartsModule } from './resources/charts/charts.module';

import { TypegooseModule } from 'nestjs-typegoose';
import { ResourceRepository } from './resources/base/resource.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      envFilePath: './config.env',
    }),
    TypegooseModule.forRootAsync({
      // This line is not needed since config module is global. will be needed if used in another app after abstraction
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('database.uri'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    ModelsModule,
    ProjectsModule,
    SimulationsModule,
    ChartsModule,
    VisualizationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ResourceRepository],
})
export class AppModule {}
