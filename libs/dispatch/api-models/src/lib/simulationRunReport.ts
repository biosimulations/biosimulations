/**
 * @file Contains API definitions for the results of simulation run, as well as general types related to results.
 * @author Bilal Shaikh <bilalshaikh42@gmail.com>
 * 2021-06-14
 * @copyright Biosimulations Team 2021
 * @license MIT
 */

import {
  ApiProperty,
  ApiResponseProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export type SimulationRunReportData = SimulationRunReportDatum[];

export const SimulationRunReportDataSchema: Omit<SchemaObject, 'required'> = {
  oneOf: [
    { type: 'array', items: { type: 'number', format: 'float' } },
    { type: 'array', items: { type: 'boolean' } },
  ],
};

export class SimulationRunReportDatum {
  @ApiProperty({ type: String })
  public id!: string;
  @ApiProperty({ type: String })
  public label!: string;
  @ApiProperty({ type: String })
  public shape!: string;
  @ApiProperty({ type: String })
  public type!: string;
  @ApiProperty(SimulationRunReportDataSchema)
  public values: (number | boolean | string)[] = [];
}

export class SimulationRunReport {
  @ApiProperty({ type: String })
  public simId!: string;

  @ApiProperty({ type: String })
  public reportId!: string;

  @ApiPropertyOptional({ type: String })
  public type!: string;

  @ApiPropertyOptional({ type: String })
  public name!: string;

  @ApiPropertyOptional({ type: String })
  public sedmlId!: string;

  @ApiPropertyOptional({ type: String })
  public sedmlName!: string;

  // Dates are serialized when sending over http. Typing must be correct to prevent client from using data operations on string objects
  @ApiResponseProperty({ type: String, format: 'date-time' })
  public created!: string;

  @ApiResponseProperty({ type: String, format: 'date-time' })
  public updated!: string;

  @ApiProperty({ type: () => [SimulationRunReportDatum] })
  public data!: SimulationRunReportData;
}

export class SimulationRunResults {
  @ApiResponseProperty({ type: String })
  public simId!: string;

  @ApiResponseProperty({ type: String, format: 'date-time' })
  public created!: string;

  @ApiResponseProperty({ type: String, format: 'date-time' })
  public updated!: string;

  @ApiResponseProperty({ type: () => [SimulationRunReport] })
  public reports!: SimulationRunReport[];
}
