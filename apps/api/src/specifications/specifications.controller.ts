import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SimulationRunSpecifications } from '@biosimulations/datamodel/api';
import { SpecificationsService } from './specifications.service';
import { SpecificationsModel } from './specifications.model';
@ApiTags('Specifications')
@Controller('specifications')
export class SpecificationsController {
  private logger = new Logger(SpecificationsController.name);

  public constructor(private service: SpecificationsService) {}

  @Get()
  public async getSpecifications(): Promise<SimulationRunSpecifications[]> {
    const specs = await this.service.getSpecifications();
    return specs.map(this.returnSpec);
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
