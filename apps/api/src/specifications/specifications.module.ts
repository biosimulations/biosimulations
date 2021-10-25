import { BiosimulationsAuthModule } from '@biosimulations/auth/nest';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecificationsController } from './specifications.controller';
import {
  SpecificationsModel,
  SpecificationsModelSchema,
  SedModelChange, SedModelChangeSchema,
  SedModelAttributeChange, SedModelAttributeChangeSchema,
  SedSimulation, SedSimulationSchema,
  SedOneStepSimulation, SedOneStepSimulationSchema,
  SedSteadyStateSimulation, SedSteadyStateSimulationSchema,
  SedUniformTimeCourseSimulation, SedUniformTimeCourseSimulationSchema,
  SedAbstractTask, SedAbstractTaskSchema,
  SedTask, SedTaskSchema,
  SedRepeatedTask, SedRepeatedTaskSchema,
  SedOutput, SedOutputSchema,
  SedReport, SedReportSchema,
  SedPlot2D, SedPlot2DSchema,
  SedPlot3D, SedPlot3DSchema,
} from './specifications.model';
import { SpecificationsService } from './specifications.service';

@Module({
  controllers: [SpecificationsController],
  imports: [
    BiosimulationsAuthModule,
    MongooseModule.forFeature([
      { name: SpecificationsModel.name, schema: SpecificationsModelSchema },
      {
        name: SedModelChange.name,
        schema: SedModelChangeSchema,
        discriminators: [
          { name: SedModelAttributeChange.name, schema: SedModelAttributeChangeSchema },
        ],
      },
      {
        name: SedSimulation.name,
        schema: SedSimulationSchema,
        discriminators: [
          { name: SedOneStepSimulation.name, schema: SedOneStepSimulationSchema },
          { name: SedSteadyStateSimulation.name, schema: SedSteadyStateSimulationSchema },
          { name: SedUniformTimeCourseSimulation.name, schema: SedUniformTimeCourseSimulationSchema },
        ],
      },
      {
        name: SedAbstractTask.name,
        schema: SedAbstractTaskSchema,
        discriminators: [
          { name: SedTask.name, schema: SedTaskSchema },
          { name: SedRepeatedTask.name, schema: SedRepeatedTaskSchema },
        ],
      },
      {
        name: SedOutput.name,
        schema: SedOutputSchema,
        discriminators: [
          { name: SedReport.name, schema: SedReportSchema },
          { name: SedPlot2D.name, schema: SedPlot2DSchema },
          { name: SedPlot3D.name, schema: SedPlot3DSchema },
        ],
      },
    ]),
  ],
  providers: [SpecificationsService],
})
export class SpecificationsModule {}
