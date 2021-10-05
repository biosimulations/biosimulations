import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SimulationRunSpecifications } from '@biosimulations/datamodel/api';
import { SpecificationsService } from './specifications.service';
import { SpecificationsModel } from './specifications.model';
import { permissions } from '@biosimulations/auth/nest';
@ApiTags('Specifications')
@Controller('specifications')
export class SpecificationsController {
  private logger = new Logger(SpecificationsController.name);

  public constructor(private service: SpecificationsService) {}

  @Get()
  @permissions('read:Specifications')
  public async getSpecifications(): Promise<SimulationRunSpecifications[]> {
    const specs = await this.service.getSpecifications();
    return specs.map(this.returnSpec);
  }

  @Get(':simId')
  public async getSpecificationsBySimulation(
    @Param('simId') simId: string,
  ): Promise<SimulationRunSpecifications[]> {
    const specs = await this.service.getSpecificationsBySimulation(simId);
    if (specs.length === 0) {
      throw new NotFoundException(
        `No specifications found for simulation ${simId}`,
      );
    }
    return specs.map(this.returnSpec);
  }

  @Get(':simId/:specId')
  public async getSpecification(
    @Param('simId') simId: string,
    @Param('specId') specId: string,
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
  public async createSpecification(
    @Body() specifications: SimulationRunSpecifications[],
  ): Promise<SimulationRunSpecifications[]> {
    const specs = await this.service.createSpecs(specifications);
    return specs.map(this.returnSpec);
  }

  @Post(':simId')
  public async createSimulationSpecification(
    @Param('simId') simId: string,
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
