/**
 * @file Specifications for the results object that is returned/posted to the API. Contains metadata about the results and shape of result data.
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
import { ApiProperty } from '@nestjs/swagger';

export class Results {
  @ApiProperty({ type: String })
  id!: string;
}
