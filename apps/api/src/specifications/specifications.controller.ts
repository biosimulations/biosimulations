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
  ApiPayloadTooLargeResponse,
} from '@nestjs/swagger';
import {
  SimulationRunSedDocument,
  SimulationRunSedDocumentInputsContainer,
  SedModel,
  SedSimulation,
  SedSimulationSchema,
  SedAbstractTask,
  SedAbstractTaskSchema,
  SedDataGenerator,
  SedOutput,
  SedOutputSchema,
} from '@biosimulations/ontology/datamodel';
import { SedElementType } from '@biosimulations/datamodel/common';
import { SpecificationsService } from './specifications.service';
import { SpecificationsModel } from './specifications.model';
import { permissions } from '@biosimulations/auth/nest';
import { ErrorResponseDocument } from '@biosimulations/datamodel/api';
import { scopes } from '@biosimulations/auth/common';

@ApiTags('Specifications')
@Controller('specifications')
export class SpecificationsController {
  private logger = new Logger(SpecificationsController.name);

  public constructor(private service: SpecificationsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get the simulation experiments of all simulation runs',
    description:
      'Get a list of the specifications of all simulation experiments \
      (SED-ML files in COMBINE/OMEX archives) of all simulation runs',
  })
  @ApiOkResponse({
    description:
      'List of the specifications of all simulation experiments \
      (SED-ML files in COMBINE/OMEX archives) of all simulation runs',
    type: [SimulationRunSedDocument],
  })
  @permissions(scopes.specifications.read.id)
  public async getSpecifications(): Promise<SimulationRunSedDocument[]> {
    const specs = await this.service.getSpecifications();
    return specs.map(this.returnSpec);
  }

  @Get(':runId')
  @ApiOperation({
    summary: 'Get the simulation experiments of a simulation run',
    description:
      'Get a list of the specifications of the simulation experiments \
      (SED-ML files in COMBINE/OMEX archive) of a simulation run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiOkResponse({
    description:
      'List of the specifications of the simulation experiments \
      (SED-ML files in COMBINE/OMEX archive) of the simulation run',
    type: [SimulationRunSedDocument],
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description: 'No simulation run has the requested id',
  })
  public async getSpecificationsBySimulation(
    @Param('runId') runId: string,
  ): Promise<SimulationRunSedDocument[]> {
    const specs = await this.service.getSpecificationsBySimulation(runId);
    if (specs.length === 0) {
      throw new NotFoundException(
        `No specifications could be found for simulation run '${runId}'.`,
      );
    }
    return specs.map(this.returnSpec);
  }

  @Get(':runId/:experimentLocation')
  @ApiOperation({
    summary: 'Get a simulation experiment of a simulation run',
    description:
      'Get the specification of a simulation experiment \
      (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiParam({
    name: 'experimentLocation',
    description:
      'Location of the simulation experiment \
      (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
    required: true,
    type: String,
  })
  @ApiOkResponse({
    description:
      'Specifications of the simulation experiment \
      (SED-ML file) of the simulation run (of a COMBINE/OMEX archive)',
    type: SimulationRunSedDocument,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description:
      'No simulation experiment has the requested simulation run id and location',
  })
  public async getSpecification(
    @Param('runId') runId: string,
    @Param('experimentLocation') experimentLocation: string,
  ): Promise<SimulationRunSedDocument> {
    const spec = await this.service.getSpecification(runId, experimentLocation);
    if (!spec) {
      throw new NotFoundException(
        `Specifications could not be found for experiment '${experimentLocation}' for simulation run '${runId}'.`,
      );
    }
    return this.returnSpec(spec);
  }

  @Get(':runId/:experimentLocation/models/:modelId')
  @ApiOperation({
    summary: 'Get a model of a simulation run',
    description:
      'Get the specification of a model (SED-ML model) of a simulation experiment \
      (SED-ML file) of a simulation run (of a COMBINE/OMEX archive)',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiParam({
    name: 'experimentLocation',
    description:
      'Location of the simulation experiment \
      (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'modelId',
    description:
      'Id of the model in the simulation experiment \
      (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-zA-Z_][a-zA-Z_0-9]*$',
    },
  })
  @ApiOkResponse({
    description: 'Specifications of the model',
    type: SedModel,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description:
      'No model has the requested simulation run id, experiment location, and model id',
  })
  public async getModelSpecification(
    @Param('runId') runId: string,
    @Param('experimentLocation') experimentLocation: string,
    @Param('modelId') modelId: string,
  ): Promise<SedModel> {
    const spec = await this.service.getElementSpecification(
      runId,
      experimentLocation,
      SedElementType.SedModel,
      modelId,
    );
    if (!spec) {
      throw new NotFoundException(
        `Specifications could not be found for model \
        '${modelId}' at location '${experimentLocation}' for simulation run '${runId}'.`,
      );
    }
    return spec;
  }

  @Get(':runId/:experimentLocation/simulations/:simulationId')
  @ApiOperation({
    summary: 'Get a simulation of a simulation run',
    description:
      'Get the specification of a simulation (SED-ML simulation) of a simulation experiment \
      (SED-ML file) of a simulation run (of a COMBINE/OMEX archive)',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiParam({
    name: 'experimentLocation',
    description:
      'Location of the simulation experiment (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'simulationId',
    description:
      'Id of the simulation in the simulation experiment (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-zA-Z_][a-zA-Z_0-9]*$',
    },
  })
  @ApiOkResponse({
    description: 'Specifications of the simulation',
    schema: SedSimulationSchema,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description:
      'No simulation has the requested simulation run id, experiment location, and simulation id',
  })
  public async getSimulationSpecification(
    @Param('runId') runId: string,
    @Param('experimentLocation') experimentLocation: string,
    @Param('simulationId') simulationId: string,
  ): Promise<SedSimulation> {
    const spec = await this.service.getElementSpecification(
      runId,
      experimentLocation,
      SedElementType.SedSimulation,
      simulationId,
    );
    if (!spec) {
      throw new NotFoundException(
        `Specifications could not be found for simulation \
        '${simulationId}' at location '${experimentLocation}' for simulation run '${runId}'.`,
      );
    }
    return spec;
  }

  @Get(':runId/:experimentLocation/tasks/:taskId')
  @ApiOperation({
    summary: 'Get a task of a simulation run',
    description:
      'Get the specification of a task (SED-ML task) of a simulation experiment \
      (SED-ML file) of a simulation run (of a COMBINE/OMEX archive)',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiParam({
    name: 'experimentLocation',
    description:
      'Location of the simulation experiment (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'taskId',
    description:
      'Id of the task in the simulation experiment (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-zA-Z_][a-zA-Z_0-9]*$',
    },
  })
  @ApiOkResponse({
    description: 'Specifications of the task',
    schema: SedAbstractTaskSchema,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description:
      'No task has the requested simulation run id, experiment location, and task id',
  })
  public async getTaskSpecification(
    @Param('runId') runId: string,
    @Param('experimentLocation') experimentLocation: string,
    @Param('taskId') taskId: string,
  ): Promise<SedAbstractTask> {
    const spec = await this.service.getElementSpecification(
      runId,
      experimentLocation,
      SedElementType.SedAbstractTask,
      taskId,
    );
    if (!spec) {
      throw new NotFoundException(
        `Specifications could not be found for task \
        '${taskId}' at location '${experimentLocation}' for simulation run '${runId}'.`,
      );
    }
    return spec;
  }

  @Get(':runId/:experimentLocation/data-generators/:dataGeneratorId')
  @ApiOperation({
    summary: 'Get a data generator of a simulation run',
    description:
      'Get the specification of a data generator (SED-ML data generator) of a simulation experiment \
      (SED-ML file) of a simulation run (of a COMBINE/OMEX archive)',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiParam({
    name: 'experimentLocation',
    description:
      'Location of the simulation experiment (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'dataGeneratorId',
    description:
      'Id of the data generator in the simulation experiment (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-zA-Z_][a-zA-Z_0-9]*$',
    },
  })
  @ApiOkResponse({
    description: 'Specifications of the data generator',
    type: SedDataGenerator,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description:
      'No data generator has the requested simulation run id, experiment location, and output id',
  })
  public async getDataGeneratorSpecification(
    @Param('runId') runId: string,
    @Param('experimentLocation') experimentLocation: string,
    @Param('dataGeneratorId') dataGeneratorId: string,
  ): Promise<SedDataGenerator> {
    const spec = await this.service.getElementSpecification(
      runId,
      experimentLocation,
      SedElementType.SedDataGenerator,
      dataGeneratorId,
    );
    if (!spec) {
      throw new NotFoundException(
        `Specifications could not be found for data generator \
        '${dataGeneratorId}' at location '${experimentLocation}' for simulation run '${runId}'.`,
      );
    }
    return spec;
  }

  @Get(':runId/:experimentLocation/outputs/:outputId')
  @ApiOperation({
    summary: 'Get an output of a simulation run',
    description:
      'Get the specification of an output (SED-ML report or plot) of a simulation experiment \
      (SED-ML file) of a simulation run (of a COMBINE/OMEX archive)',
  })
  @ApiParam({
    name: 'runId',
    description: 'Id of the simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiParam({
    name: 'experimentLocation',
    description:
      'Location of the simulation experiment (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
    required: true,
    type: String,
  })
  @ApiParam({
    name: 'outputId',
    description:
      'Id of the output in the simulation experiment (SED-ML file in the COMBINE/OMEX archive) of a simulation run',
    required: true,
    type: String,
    schema: {
      pattern: '^[a-zA-Z_][a-zA-Z_0-9]*$',
    },
  })
  @ApiOkResponse({
    description: 'Specifications of the output',
    schema: SedOutputSchema,
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDocument,
    description:
      'No output has the requested simulation run id, experiment location, and output id',
  })
  public async getOutputSpecification(
    @Param('runId') runId: string,
    @Param('experimentLocation') experimentLocation: string,
    @Param('outputId') outputId: string,
  ): Promise<SedOutput> {
    const spec = await this.service.getElementSpecification(
      runId,
      experimentLocation,
      SedElementType.SedOutput,
      outputId,
    );
    if (!spec) {
      throw new NotFoundException(
        `Specifications could not be found for output \
        '${outputId}' at location '${experimentLocation}' for simulation run '${runId}'.`,
      );
    }
    return spec;
  }

  @Post(':runId')
  @permissions(scopes.specifications.create.id)
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
    schema: {
      pattern: '^[a-f\\d]{24}$',
    },
  })
  @ApiBody({
    description:
      'Specifications of the simulation experiment of the simulation run',
    type: SimulationRunSedDocumentInputsContainer,
  })
  @ApiPayloadTooLargeResponse({
    type: ErrorResponseDocument,
    description:
      'The payload is too large. The payload must be less than the server limit.',
  })
  @ApiCreatedResponse({
    description: 'The simulation experiments were successfully saved',
  })
  public async createSpecification(
    @Param('runId') runId: string,
    @Body() specifications: SimulationRunSedDocumentInputsContainer,
  ): Promise<void> {
    await this.service.createSpecs(runId, specifications.sedDocuments);
    return;
  }

  private returnSpec(specs: SpecificationsModel): SimulationRunSedDocument {
    return {
      id: specs.id,
      level: specs.level,
      version: specs.version,
      styles: specs.styles,
      models: specs.models,
      simulations: specs.simulations,
      outputs: specs.outputs,
      tasks: specs.tasks,
      dataGenerators: specs.dataGenerators,
      created: specs.created.toISOString(),
      updated: specs.updated.toISOString(),
      simulationRun: specs.simulationRun,
    };
  }
}
