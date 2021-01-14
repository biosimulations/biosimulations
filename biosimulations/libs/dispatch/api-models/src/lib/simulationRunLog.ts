import {
  ApiProperty,
} from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { SimulationRunLogStatus as Status } from '@biosimulations/datamodel/common';

export type SedOutputElementStatusMap = { [id: string]: Status };
export const SedOutputElementStatusMapArraySchema: SchemaObject = { type: 'array', items: { type: 'Status' } };
export const SedOutputElementStatusMapSchema: Omit<SchemaObject, 'required'> = {
  type: 'object',
  additionalProperties: SedOutputElementStatusMapArraySchema,
  nullable: true,
};

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

  @ApiProperty(SedOutputElementStatusMapSchema)
  dataSets!: SedOutputElementStatusMap | null;
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

  @ApiProperty(SedOutputElementStatusMapSchema)
  curves!: SedOutputElementStatusMap | null;
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

  @ApiProperty(SedOutputElementStatusMapSchema)
  surfaces!: SedOutputElementStatusMap | null;
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
}

export type SedTaskLogMap = { [id: string]: SedTaskLog };
export type SedOutputLogMap = { [id: string]: SedReportLog | SedPlot2DLog | SedPlot3DLog };
export const SedTaskLogMapArraySchema: SchemaObject = { type: 'array', items: { type: 'SedTaskLog' } };
export const SedOutputLogMapArraySchema: SchemaObject = { 
    oneOf: [
        {type: 'array', items: { type: 'SedReportLog' }},
        {type: 'array', items: { type: 'SedPlot2DLog' }},
        {type: 'array', items: { type: 'SedPlot3DLog' }},
    ],
};
export const SedTaskLogMapSchema: Omit<SchemaObject, 'required'> = {
  type: 'object',
  additionalProperties: SedTaskLogMapArraySchema,
  nullable: true,
};
export const SedOutputLogMapSchema: Omit<SchemaObject, 'required'> = {
  type: 'object',
  additionalProperties: SedOutputLogMapArraySchema,
  nullable: true,
};

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

  @ApiProperty(SedTaskLogMapSchema)
  tasks!: SedTaskLogMap | null;

  @ApiProperty(SedOutputLogMapSchema)
  outputs!: SedOutputLogMap | null;
}

export type SedDocumentLogMap = { [id: string]: SedDocumentLog };
export const SedDocumentLogMapArraySchema: SchemaObject = { type: 'array', items: { type: 'SedDocumentLog' } };
export const SedDocumentLogMapSchema: Omit<SchemaObject, 'required'> = {
  type: 'object',
  additionalProperties: SedDocumentLogMapArraySchema,
  nullable: true,
};

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

  @ApiProperty(SedDocumentLogMapSchema)
  sedDocuments!: SedDocumentLogMap | null;
}
