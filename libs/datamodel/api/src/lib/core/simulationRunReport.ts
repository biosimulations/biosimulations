/**
 * @file Contains API definitions for the results of simulation run, as well as general types related to results.
 * @author Bilal Shaikh <bilalshaikh42@gmail.com>
 * 2021-06-14
 * @copyright Biosimulations Team 2021
 * @license MIT
 */

import {
  SimulationRunResults as ISimulationRunResults,
  SimulationRunOutput as ISimulationRunOutput,
  SimulationRunOutputDatum as ISimulationRunOutputDatum,
} from '@biosimulations/datamodel/common';
import {
  ApiProperty,
  ApiResponseProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const SimulationRunOutputDatumValuesSchema: Omit<
  SchemaObject,
  'required'
> = {
  oneOf: [
    { type: 'array', items: { type: 'number', format: 'float' } },
    { type: 'array', items: { type: 'boolean' } },
  ],
};

export class SimulationRunOutputDatum implements ISimulationRunOutputDatum {
  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String })
  public label!: string;

  @ApiProperty({ type: String })
  public name?: string;

  @ApiProperty({ type: String })
  public shape!: string;

  @ApiProperty({ type: String })
  // "float64", "int" etc. Not the same as seddatatype
  public type!: string;

  @ApiProperty(SimulationRunOutputDatumValuesSchema)
  public values: (number | boolean | string)[] = [];
}

export type SimulationRunOutputData = SimulationRunOutputDatum[];

export class SimulationRunOutput implements ISimulationRunOutput {
  @ApiProperty({ type: String })
  public simId!: string;

  @ApiProperty({ type: String })
  public outputId!: string;

  @ApiPropertyOptional({ type: String })
  // "SedReport" , "SedPlot2D", "SedPlot3D" see #2442
  public type!: string;

  @ApiPropertyOptional({ type: String })
  public name!: string;

  // Dates are serialized when sending over http. Typing must be correct to prevent client from using data operations on string objects
  @ApiResponseProperty({ type: String, format: 'date-time' })
  public created!: string;

  @ApiResponseProperty({ type: String, format: 'date-time' })
  public updated!: string;

  @ApiProperty({ type: () => [SimulationRunOutputDatum] })
  public data!: SimulationRunOutputData;
}

export class SimulationRunResults implements ISimulationRunResults {
  @ApiResponseProperty({ type: String })
  public simId!: string;

  @ApiResponseProperty({ type: String, format: 'date-time' })
  public created!: string;

  @ApiResponseProperty({ type: String, format: 'date-time' })
  public updated!: string;

  @ApiResponseProperty({ type: () => [SimulationRunOutput] })
  public outputs!: SimulationRunOutput[];
}
