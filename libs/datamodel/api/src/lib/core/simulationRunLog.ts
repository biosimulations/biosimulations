import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

import {  
  CombineArchiveLog as ICombineArchiveLog,
  SedDocumentLog as ISedDocumentLog,
  SedTaskLog as ISedTaskLog,
  SimulatorDetail as ISimulatorDetail,
  SedReportLog as ISedReportLog,
  SedPlot2DLog as ISedPlot2DLog,
  SedPlot3DLog as ISedPlot3DLog,
  SedOutputElementLog as ISedOutputElementLog,
  SimulationRunLogStatus,
  Exception as IException,
} from '@biosimulations/datamodel/common';

export class Exception implements IException {
  @ApiProperty({ type: String, example: 'FileNotFoundError' })
  category!: string;

  @ApiProperty({ type: String, example: "File 'model.xml' does not exist." })
  message!: string;
}

export class SedOutputElementLog implements ISedOutputElementLog{
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String, enum: SimulationRunLogStatus })
  status!: SimulationRunLogStatus;
}

export class SedReportLog implements ISedReportLog {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String, enum: SimulationRunLogStatus })
  status!: SimulationRunLogStatus;

  @ApiProperty({ type: Exception, nullable: true })
  exception!: Exception | null;

  @ApiProperty({ type: Exception, nullable: true })
  skipReason!: Exception | null;

  @ApiProperty({
    type: String,
    example:
      'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  output!: string | null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  duration!: number | null;

  @ApiProperty({ type: [SedOutputElementLog], nullable: true })
  dataSets!: SedOutputElementLog[] | null;
}

export class SedPlot2DLog implements ISedPlot2DLog {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String, enum: SimulationRunLogStatus })
  status!: SimulationRunLogStatus;

  @ApiProperty({ type: Exception, nullable: true })
  exception!: Exception | null;

  @ApiProperty({ type: Exception, nullable: true })
  skipReason!: Exception | null;

  @ApiProperty({
    type: String,
    example:
      'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  output!: string | null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  duration!: number | null;

  @ApiProperty({ type: [SedOutputElementLog], nullable: true })
  curves!: SedOutputElementLog[] | null;
}

export class SedPlot3DLog implements ISedPlot3DLog {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String, enum: SimulationRunLogStatus })
  status!: SimulationRunLogStatus;

  @ApiProperty({ type: Exception, nullable: true })
  exception!: Exception | null;

  @ApiProperty({ type: Exception, nullable: true })
  skipReason!: Exception | null;

  @ApiProperty({
    type: String,
    example:
      'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  output!: string | null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  duration!: number | null;

  @ApiProperty({ type: [SedOutputElementLog], nullable: true })
  surfaces!: SedOutputElementLog[] | null;
}

export class SimulatorDetail implements ISimulatorDetail {
  @ApiProperty({ type: String, example: 'arguments' })
  key!: string;

  @ApiProperty({ type: Object, example: { relTol: 1e-6, absTol: 1e-8 } })
  value!: any;
}

export class SedTaskLog implements ISedTaskLog {
  @ApiProperty({ type: String })
  id!: string;

  @ApiProperty({ type: String, enum: SimulationRunLogStatus })
  status!: SimulationRunLogStatus;

  @ApiProperty({ type: Exception, nullable: true })
  exception!: Exception | null;

  @ApiProperty({ type: Exception, nullable: true })
  skipReason!: Exception | null;

  @ApiProperty({
    type: String,
    example:
      'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  output!: string | null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  duration!: number | null;

  @ApiProperty({
    type: String, 
    description: 'KiSAO id of the simulation algorithm that was executed',
    example: 'KISAO_0000019', 
    nullable: true
  })
  algorithm!: string | null;

  @ApiProperty({ type: [SimulatorDetail], nullable: true })
  simulatorDetails!: SimulatorDetail[] | null;
}

export class SedDocumentLog implements ISedDocumentLog {
  @ApiProperty({ type: String })
  location!: string;

  @ApiProperty({ type: String, enum: SimulationRunLogStatus })
  status!: SimulationRunLogStatus;

  @ApiProperty({ type: Exception, nullable: true })
  exception!: Exception | null;

  @ApiProperty({ type: Exception, nullable: true })
  skipReason!: Exception | null;

  @ApiProperty({
    type: String,
    example:
      'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  output!: string | null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  duration!: number | null;

  @ApiProperty({ type: [SedTaskLog], nullable: true })
  tasks!: SedTaskLog[] | null;

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(SedReportLog) },
        { $ref: getSchemaPath(SedPlot2DLog) },
        { $ref: getSchemaPath(SedPlot3DLog) },
      ],
    },
    nullable: true,
  })
  outputs!: (SedReportLog | SedPlot2DLog | SedPlot3DLog)[] | null;
}

export class CombineArchiveLog implements ICombineArchiveLog {
  @ApiProperty({ type: String, enum: SimulationRunLogStatus })
  status!: SimulationRunLogStatus;

  @ApiProperty({ type: Exception, nullable: true })
  exception!: Exception | null;

  @ApiProperty({ type: Exception, nullable: true })
  skipReason!: Exception | null;

  @ApiProperty({
    type: String,
    example:
      'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  output!: string | null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  duration!: number | null;

  @ApiProperty({ type: [SedDocumentLog], nullable: true })
  sedDocuments!: SedDocumentLog[] | null;
}

export class CreateSimulationRunLogBody {
  @ApiProperty()
  simId!: string;

  @ApiProperty()
  log!: CombineArchiveLog;
}
