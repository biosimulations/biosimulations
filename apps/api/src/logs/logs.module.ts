import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SimulationRunModel,
  SimulationRunModelSchema,
} from '../simulation-run/simulation-run.model';
import { LogsController } from './logs.controller';
import {
  SimulationRunLog, SimulationRunLogSchema, 
  CombineArchiveLog, CombineArchiveLogSchema,
  SedOutputLog, SedOutputLogSchema,
  SedReportLog, SedReportLogSchema,
  SedPlot2DLog, SedPlot2DLogSchema,
  SedPlot3DLog, SedPlot3DLogSchema,
} from './logs.model';

import { LogsService } from './logs.service';

@Module({
  controllers: [LogsController],
  imports: [
    BiosimulationsAuthModule,
    MongooseModule.forFeature([
      { name: SimulationRunLog.name, schema: SimulationRunLogSchema },
      { name: SimulationRunModel.name, schema: SimulationRunModelSchema },
      { name: CombineArchiveLog.name, schema: CombineArchiveLogSchema },
      {
        name: SedOutputLog.name,
        schema: SedOutputLogSchema,
        discriminators: [
          { name: SedReportLog.name, schema: SedReportLogSchema },
          { name: SedPlot2DLog.name, schema: SedPlot2DLogSchema },
          { name: SedPlot3DLog.name, schema: SedPlot3DLogSchema },
        ],
      },
    ]),
  ],

  providers: [LogsService],
})
export class LogsModule {}
