/**
 * @file Contains API definitions for the results of simulation run, as well as general types related to results.
 * @author Bilal Shaikh <bilalshaikh42@gmail.com>
 * 2020-12-13
 * @copyright Biosimulations Team 2020
 * @license MIT
 */

import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

// TODO RENAME
export type SimulationRunReportDataArray = SimulationRunReportDatum[];

// TODO REMOVE
export type SimulationRunReportData =
  | { [key: string]: Array<number> }
  | { [key: string]: Array<boolean> };


// TODO REMOVE 
export const SimulationRunReportDataArraySchema: Omit<SchemaObject,'required'> = {
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
  @ApiProperty(SimulationRunReportDataArraySchema)
  public values: number[] | boolean[] = [];
}

export type SimulationRunReportDataStrings = { [key: string]: Array<string> };

// TODO REMOVE 
export const SimulationRunReportDataSchema: Omit<SchemaObject, 'required'> = {
  type: 'object',
  additionalProperties: SimulationRunReportDataArraySchema,
  example: {
    'property-1': [5.0, 2.3, 25.0],
    'property-2': [true, true, false],
  },
};

// TODO REMOVE 
export class SimulationRunReport {
  @ApiProperty({ type: String })
  public simId!: string;
  @ApiProperty({ type: String })
  public reportId!: string;
  @ApiProperty(SimulationRunReportDataSchema)
  public data!: SimulationRunReportData;
  @ApiResponseProperty({ type: String, format: 'date-time' })
  public created!: Date;
  @ApiResponseProperty({ type: String, format: 'date-time' })
  public updated!: Date;
}
// TODO RENAME
export class SimulationRunArrayReport {
  @ApiProperty({ type: String })
  public simId!: string;
  @ApiProperty({ type: String })
  public reportId!: string;
  @ApiProperty({ type: () => [SimulationRunReportDatum] })
  public data!: SimulationRunReportDataArray;
  @ApiResponseProperty({ type: String, format: 'date-time' })
  public created!: Date;
  @ApiResponseProperty({ type: String, format: 'date-time' })
  public updated!: Date;
}
// TODO REMOVE 
export class SimulationRunResults {
  @ApiResponseProperty({ type: String })
  public simId!: string;

  @ApiResponseProperty({ type: () => [SimulationRunReport] })
  public reports!: SimulationRunReport[];
}
// TODO RENAME
export class SimulationRunArrayResults {
  @ApiResponseProperty({ type: String })
  public simId!: string;

  @ApiResponseProperty({ type: () => [SimulationRunArrayReport] })
  public reports!: SimulationRunArrayReport[];
}
