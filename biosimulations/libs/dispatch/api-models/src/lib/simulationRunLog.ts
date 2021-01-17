import {
  ApiProperty,
} from '@nestjs/swagger';
import { SimulationRunLogStatus as Status } from '@biosimulations/datamodel/common';

export class Exception {
  @ApiProperty({ type: String, example: 'FileNotFoundError' })
  category!: string;

  @ApiProperty({ type: String, example: "File 'model.xml' does not exist." })
  message!: string;
}

export class SedReportLog {
  @ApiProperty({ type: String, enum: Status })
  status!: Status;

  @ApiProperty({ type: Exception, nullable: true })
  exception!: Exception | null;

  @ApiProperty({ type: Exception, nullable: true })
  skipReason!: Exception | null;

  @ApiProperty({
    type: String,
    example: 'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  output!: string | null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  duration!: number | null;

  @ApiProperty({ type: [SedOutputElementStatus], nullable: true })
  dataSets!: SedOutputElementStatus[] | null;
}

export class SedPlot2DLog {
  @ApiProperty({ type: String, enum: Status })
  status!: Status;

  @ApiProperty({ type: Exception, nullable: true })
  exception!: Exception | null;

  @ApiProperty({ type: Exception, nullable: true })
  skipReason!: Exception | null;

  @ApiProperty({
    type: String,
    example: 'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  output!: string | null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  duration!: number | null;

  @ApiProperty({ type: [SedOutputElementStatus], nullable: true })
  curves!: SedOutputElementStatus[] | null;
}

export class SedPlot3DLog {
  @ApiProperty({ type: String, enum: Status })
  status!: Status;

  @ApiProperty({ type: Exception, nullable: true })
  exception!: Exception | null;

  @ApiProperty({ type: Exception, nullable: true })
  skipReason!: Exception | null;

  @ApiProperty({
    type: String,
    example: 'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  output!: string | null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  duration!: number | null;

  @ApiProperty({ type: [SedOutputElementStatus], nullable: true })
  surfaces!: SedOutputElementStatus[] | null;
}

export class SimulatorDetail {
  @ApiProperty({ type: String, example: 'arguments' })
  key!: string;

  @ApiProperty({ type: Object, example: {relTol: 1e-6, absTol: 1e-8} })
  value!: any;
}

export class SedTaskLog {
  @ApiProperty({ type: String, enum: Status })
  status!: Status;

  @ApiProperty({ type: Exception, nullable: true })
  exception!: Exception | null;

  @ApiProperty({ type: Exception, nullable: true })
  skipReason!: Exception | null;

  @ApiProperty({
    type: String,
    example: 'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  output!: string | null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  duration!: number | null;

  @ApiProperty({ type: String, example: 'KISAO_0000019', nullable: true })
  algorithm: string | null;
  
  @ApiProperty({ type: [SimulatorDetail], nullable: true })  
  simulatorDetails: SimulatorDetail[] | null;
}

export class SedDocumentLog {
  @ApiProperty({ type: String, enum: Status })
  status!: Status;

  @ApiProperty({ type: Exception, nullable: true })
  exception!: Exception | null;

  @ApiProperty({ type: Exception, nullable: true })
  skipReason!: Exception | null;

  @ApiProperty({
    type: String,
    example: 'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
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
        { type: SedReportLog },
        { type: SedPlot2DLog },
        { type: SedPlot3DLog },
      ],
    },
    nullable: true
  })
  outputs!: (SedReportLog | SedPlot2DLog | SedPlot3DLog)[] | null;
}

export class CombineArchiveLog {
  @ApiProperty({ type: String, enum: Status })
  status!: Status;

  @ApiProperty({ type: Exception, nullable: true })
  exception!: Exception | null;

  @ApiProperty({ type: Exception, nullable: true })
  skipReason!: Exception | null;

  @ApiProperty({
    type: String,
    example: 'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  output!: string | null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  duration!: number | null;

  @ApiProperty({ type: [SedDocumentLog], nullable: true })
  sedDocuments!: SedDocumentLog[] | null;
}
