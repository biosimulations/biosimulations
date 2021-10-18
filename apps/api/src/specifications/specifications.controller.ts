import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { SimulationRunSpecifications } from '@biosimulations/datamodel/api';
import { SpecificationsService } from './specifications.service';
import { SpecificationsModel } from './specifications.model';
import { permissions } from '@biosimulations/auth/nest';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';

@ApiTags('Specifications')
@Controller('specifications')
export class SpecificationsController {
  private logger = new Logger(SpecificationsController.name);

  public constructor(private service: SpecificationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get the simulation experiments of all simulation runs',
    description:
      'Get a list of the specifications of all simulation experiments (SED-ML files in COMBINE/OMEX archives) of all simulation runs',
  })
  @ApiOkResponse({
    description:
      'List of the specifications of all simulation experiments (SED-ML files in COMBINE/OMEX archives) of all simulation runs',
    type: [SimulationRunSpecifications],
  })
  @permissions('read:Specifications')
  public async getSpecifications(): Promise<SimulationRunSpecifications[]> {
    const specs = await this.service.getSpecifications();
    return specs.map(this.returnSpec);
  }

  @Get(':runId')
  @ApiOperation({
    summary: 'Get the simulation experiments of a simulation run',
    description:
      'Get a list of the specifications of the simulation experiments (SED-ML files in COMBINE/OMEX archive) of a simulation run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description:
      'List of the specifications of the simulation experiments (SED-ML files in COMBINE/OMEX archive) of the simulation run',
    type: [SimulationRunSpecifications],
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No simulation run has the requested id',
  })
  public async getSpecificationsBySimulation(
    @Param('runId') simId: string,
  ): Promise<SimulationRunSpecifications[]> {
    const specs = await this.service.getSpecificationsBySimulation(simId);
    if (specs.length === 0) {
      throw new NotFoundException(
        `No specifications found for simulation ${simId}`,
      );
    }
    return specs.map(this.returnSpec);
  }

  @Get(':runId/:experimentLocation')
  @ApiOperation({
    summary: 'Get a simulation experiment of a simulation run',
    description:
      'Get the specification of a simulation experiment (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'experimentLocation',
    description:
      'Location of the simulation experiment (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description:
      'Specifications of the simulation experiment (SED-ML file in COMBINE/OMEX archive) of the simulation run',
    type: SimulationRunSpecifications,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description:
      'No SED-ML document has the requested simulation run id and location',
  })
  public async getSpecification(
    @Param('runId') simId: string,
    @Param('experimentLocation') specId: string,
  ): Promise<SimulationRunSpecifications> {
    const spec = await this.service.getSpecification(simId, specId);
    if (!spec) {
      throw new NotFoundException(
        `Specification with id ${specId} for simulation ${simId} not found`,
      );
    }
    return this.returnSpec(spec);
  }

  @Post()
  @permissions('write:Specifications')
  @ApiOperation({
    summary: 'Save the simulation experiments of a simulation run',
    description:
      'Save the specifications of the simulation experiments (SED-ML files in the COMBINE/OMEX archive) of a simulation run',
  })
  @ApiBody({
    description:
      'Specifications of the simulation experiment of the simulation run',
    type: [SimulationRunSpecifications],
  })
  @ApiCreatedResponse({
    description: 'The simulation experiments were succcessfully saved',
    type: [SimulationRunSpecifications],
  })
  public async createSpecification(
    @Body() specifications: SimulationRunSpecifications[],
  ): Promise<SimulationRunSpecifications[]> {
    const specs = await this.service.createSpecs(specifications);
    return specs.map(this.returnSpec);
  }

  @Post(':runId')
  @permissions('write:Specifications')
  @ApiOperation({
    summary: 'Save the simulation experiments of a simulation run',
    description:
      'Save the specifications of the simulation experiments (SED-ML files in the COMBINE/OMEX archive) of a simulation run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
  })
  @ApiBody({
    description:
      'Specifications of the simulation experiment of the simulation run',
    type: [SimulationRunSpecifications],
  })
  @ApiCreatedResponse({
    description: 'The simulation experiments were succcessfully saved',
    type: [SimulationRunSpecifications],
  })
  public async createSimulationSpecification(
    @Param('runId') simId: string,
    @Body() specifications: SimulationRunSpecifications[],
  ): Promise<SimulationRunSpecifications[]> {
    const specs = await this.service.createSpecs(specifications);
    return specs.map(this.returnSpec);
  }

  private returnSpec(specs: SpecificationsModel): SimulationRunSpecifications {
    return {
      id: specs.id,
      models: specs.models,
      simulations: specs.simulations,
      outputs: specs.outputs,
      tasks: specs.tasks,
      dataGenerators: specs.dataGenerators,
      created: specs.created,
      updated: specs.updated,
      simulationRun: specs.simulationRun,
    };
  }
}
