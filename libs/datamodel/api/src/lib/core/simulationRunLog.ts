import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

import {
  CombineArchiveLog as ICombineArchiveLog,
  SedDocumentLog as ISedDocumentLog,
  SedTaskLog as ISedTaskLog,
  SimulatorDetail as ISimulatorDetail,
  SedOutputLog as ISedOutputLog,
  SedReportLog as ISedReportLog,
  SedPlot2DLog as ISedPlot2DLog,
  SedPlot3DLog as ISedPlot3DLog,
  SedOutputElementLog as ISedOutputElementLog,
  SimulationRunLogStatus,
  Exception as IException,
  Ontologies,
} from '@biosimulations/datamodel/common';

import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  Min,
  Matches,
  NotContains,
  IsMongoId,
  ValidateNested,
  IsOptional,
} from 'class-validator';
import { IsOntologyTerm } from '@biosimulations/ontology/utils';
import { Type, Transform } from 'class-transformer';

export class Exception implements IException {
  @ApiProperty({ type: String, example: 'FileNotFoundError' })
  @IsNotEmpty()
  @IsString()
  category!: string;

  @ApiProperty({ type: String, example: "File 'model.xml' does not exist." })
  @IsNotEmpty()
  @IsString()
  message!: string;
}

export class SedOutputElementLog implements ISedOutputElementLog {
  @ApiProperty({ type: String })
  @NotContains('/')
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty({ type: String, enum: SimulationRunLogStatus })
  @IsEnum(SimulationRunLogStatus)
  status!: SimulationRunLogStatus;
}

export class SedOutputLog implements ISedOutputLog {
  // _type!: string;

  @ApiProperty({ type: String })
  @NotContains('/')
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty({ type: String, enum: SimulationRunLogStatus })
  @IsEnum(SimulationRunLogStatus)
  status!: SimulationRunLogStatus;

  @ApiProperty({ type: Exception, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => Exception)
  exception: Exception | null = null;

  @ApiProperty({ type: Exception, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => Exception)
  skipReason: Exception | null = null;

  @ApiProperty({
    type: String,
    example:
      'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  output: string | null = null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  @IsOptional()
  @Min(0)
  @IsNumber()
  duration: number | null = null;
}

export class SedReportLog extends SedOutputLog implements ISedReportLog {
  @ApiProperty({ type: [SedOutputElementLog], nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SedOutputElementLog)
  dataSets: SedOutputElementLog[] | null = null;
}

export class SedPlot2DLog extends SedOutputLog implements ISedPlot2DLog {
  @ApiProperty({ type: [SedOutputElementLog], nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SedOutputElementLog)
  curves: SedOutputElementLog[] | null = null;
}

export class SedPlot3DLog extends SedOutputLog implements ISedPlot3DLog {
  @ApiProperty({ type: [SedOutputElementLog], nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SedOutputElementLog)
  surfaces: SedOutputElementLog[] | null = null;
}

export class SimulatorDetail implements ISimulatorDetail {
  @ApiProperty({ type: String, example: 'arguments' })
  @IsNotEmpty()
  @IsString()
  key!: string;

  @ApiProperty({ type: Object, example: { relTol: 1e-6, absTol: 1e-8 } })
  value!: any;
}

export class SedTaskLog implements ISedTaskLog {
  @ApiProperty({ type: String })
  @NotContains('/')
  @IsNotEmpty()
  @IsString()
  id!: string;

  @ApiProperty({ type: String, enum: SimulationRunLogStatus })
  @IsEnum(SimulationRunLogStatus)
  status!: SimulationRunLogStatus;

  @ApiProperty({ type: Exception, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => Exception)
  exception: Exception | null = null;

  @ApiProperty({ type: Exception, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => Exception)
  skipReason: Exception | null = null;

  @ApiProperty({
    type: String,
    example:
      'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  output: string | null = null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  @IsOptional()
  @Min(0)
  @IsNumber()
  duration: number | null = null;

  @ApiProperty({
    type: String,
    description: 'KiSAO id of the simulation algorithm that was executed',
    example: 'KISAO_0000019',
    nullable: true,
  })
  @IsOptional()
  @IsOntologyTerm(Ontologies.KISAO, 'KISAO_0000000')
  @Matches(/^KISAO_\d{7,7}$/)
  @IsString()
  algorithm: string | null = null;

  @ApiProperty({ type: [SimulatorDetail], nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SimulatorDetail)
  simulatorDetails: SimulatorDetail[] | null = null;
}

export class SedDocumentLog implements ISedDocumentLog {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  location!: string;

  @ApiProperty({ type: String, enum: SimulationRunLogStatus })
  @IsEnum(SimulationRunLogStatus)
  status!: SimulationRunLogStatus;

  @ApiProperty({ type: Exception, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => Exception)
  exception: Exception | null = null;

  @ApiProperty({ type: Exception, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => Exception)
  skipReason: Exception | null = null;

  @ApiProperty({
    type: String,
    example:
      'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  output: string | null = null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  @IsOptional()
  @Min(0)
  @IsNumber()
  duration: number | null = null;

  @ApiProperty({ type: [SedTaskLog], nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => {
    return SedTaskLog;
  })
  tasks: SedTaskLog[] | null = null;

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
  @IsOptional()
  @Transform(({ value }) => {
    value?.forEach((v: any): void => {
      if (typeof v === 'object' && 'dataSets' in v) {
        v._type = 'SedReportLog';
      }
      if (typeof v === 'object' && 'curves' in v) {
        v._type = 'SedPlot2DLog';
      }
      if (typeof v === 'object' && 'surfaces' in v) {
        v._type = 'SedPlot3DLog';
      }
    });
  })
  @ValidateNested({ each: true })
  @Type(() => SedOutputLog, {
    discriminator: {
      property: '_type',
      subTypes: [
        { value: SedReportLog, name: 'SedReportLog' },
        { value: SedPlot2DLog, name: 'SedPlot2DLog' },
        { value: SedPlot3DLog, name: 'SedPlot3DLog' },
      ],
    },
  })
  outputs: (SedReportLog | SedPlot2DLog | SedPlot3DLog)[] | null = null;
}

export class CombineArchiveLog implements ICombineArchiveLog {
  @ApiProperty({ type: String, enum: SimulationRunLogStatus })
  @IsEnum(SimulationRunLogStatus)
  status!: SimulationRunLogStatus;

  @ApiProperty({ type: Exception, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => Exception)
  exception: Exception | null = null;

  @ApiProperty({ type: Exception, nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => Exception)
  skipReason: Exception | null = null;

  @ApiProperty({
    type: String,
    example:
      'Reading model ... done\nExecuting model ... done\nSaving results ... done\n',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  output: string | null = null;

  @ApiProperty({ type: Number, example: 10.5, nullable: true })
  @IsOptional()
  @Min(0)
  @IsNumber()
  duration: number | null = null;

  @ApiProperty({ type: [SedDocumentLog], nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SedDocumentLog)
  sedDocuments: SedDocumentLog[] | null = null;
}

export class CreateSimulationRunLogBody {
  @ApiProperty({ type: String })
  @IsMongoId()
  simId!: string;

  @ApiProperty({ type: CombineArchiveLog })
  @ValidateNested()
  @Type(() => CombineArchiveLog)
  log!: CombineArchiveLog;
}
