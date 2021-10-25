import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  SimulationRunSedDocument as ISimulationRunSedDocument,
  SedModel,
  SedSimulation,
  SedTask,
  SedDataGenerator,
  SedOutput,
} from '@biosimulations/datamodel/common';

export class SimulationRunSedDocument implements ISimulationRunSedDocument {
  @ApiProperty({ type: String })
  public id!: string;

  @ApiProperty({ type: String })
  public simulationRun!: string;

  @ApiProperty({ type: [Object] })
  public models!: SedModel[];

  @ApiProperty({ type: [Object] })
  public simulations!: SedSimulation[];

  @ApiProperty({ type: [Object] })
  public dataGenerators!: SedDataGenerator[];

  @ApiProperty({ type: [Object] })
  public outputs!: SedOutput[];

  @ApiProperty({ type: [Object] })
  public tasks!: SedTask[];

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description: 'Timestamp when the specifications were created',
  })
  public created!: string;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description: 'Timestamp when the specifications were last updated',
  })
  public updated!: string;
}
