/**
 * @file Contains API definitions for the results of simulation run, as well as general types related to results.
 * @author Bilal Shaikh <bilalshaikh42@gmail.com>
 * 2020-12-13
 * @copyright Biosimulations Team 2020
 * @license MIT
 */

import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';

export type SimulationRunReportData = { [key: string]: Array<number> };

export class SimulationRunReport {
  @ApiProperty({ type: String })
  simId!: string;
  @ApiProperty({ type: String })
  reportId!: string;
  @ApiProperty()
  data!: SimulationRunReportData;
  @ApiResponseProperty({ type: String, format: 'date-time' })
  created!: Date;
  @ApiResponseProperty({ type: String, format: 'date-time' })
  updated!: Date;
}

export type SimulationRunReports = { [key: string]: SimulationRunReportData };
export class SimulationRunResults {
  @ApiResponseProperty({ type: String })
  simId!: string;
  @ApiResponseProperty({ type: String, format: 'date-time' })
  created!: Date;
  @ApiResponseProperty({ type: String, format: 'date-time' })
  updated!: Date;
  @ApiResponseProperty()
  reports!: SimulationRunReports[];
}
export class SparseSimulationRunResults {
  @ApiResponseProperty({ type: String })
  simId!: string;
  @ApiResponseProperty({ type: String, format: 'date-time' })
  created!: Date;
  @ApiResponseProperty({ type: String, format: 'date-time' })
  updated!: Date;
  @ApiResponseProperty()
  reports!: String[];
}
