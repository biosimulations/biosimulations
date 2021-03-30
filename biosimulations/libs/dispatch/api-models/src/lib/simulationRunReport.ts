/**
 * @file Contains API definitions for the results of simulation run, as well as general types related to results.
 * @author Bilal Shaikh <bilalshaikh42@gmail.com>
 * 2020-12-13
 * @copyright Biosimulations Team 2020
 * @license MIT
 */

import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export type SimulationRunReportData =
  | { [key: string]: Array<number> }
  | { [key: string]: Array<boolean> };
export type SimulationRunReportDatum = {
  id: string;
  label: string;
  values: number[] | boolean[];
}
export type SimulationRunReportDataStrings = { [key: string]: Array<string> };
export const SimulationRunReportDataArraySchema: SchemaObject = {
  oneOf: [
    { type: 'array', items: { type: 'number', format: 'float' } },
    { type: 'array', items: { type: 'boolean' } },
  ],
};

export const SimulationRunReportDataSchema: Omit<SchemaObject, 'required'> = {
  type: 'object',
  additionalProperties: SimulationRunReportDataArraySchema,
  example: {
    'property-1': [5.0, 2.3, 25.0],
    'property-2': [true, true, false],
  },
};

export class SimulationRunReport {
  @ApiProperty({ type: String })
  simId!: string;
  @ApiProperty({ type: String })
  reportId!: string;
  @ApiProperty(SimulationRunReportDataSchema)
  data!: SimulationRunReportData;
  @ApiResponseProperty({ type: String, format: 'date-time' })
  created!: Date;
  @ApiResponseProperty({ type: String, format: 'date-time' })
  updated!: Date;
}

export class SimulationRunResults {
  @ApiResponseProperty({ type: String })
  simId!: string;

  @ApiResponseProperty({ type: () => [SimulationRunReport] })
  reports!: SimulationRunReport[];
}
