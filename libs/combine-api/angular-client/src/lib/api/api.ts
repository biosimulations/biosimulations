export * from './health.service';
import { HealthService } from './health.service';
export * from './metadata.service';
import { MetadataService } from './metadata.service';
export * from './models.service';
import { ModelsService } from './models.service';
export * from './simulationAlgorithms.service';
import { SimulationAlgorithmsService } from './simulationAlgorithms.service';
export * from './simulationExecution.service';
import { SimulationExecutionService } from './simulationExecution.service';
export * from './simulationExperiments.service';
import { SimulationExperimentsService } from './simulationExperiments.service';
export * from './simulationProjects.service';
import { SimulationProjectsService } from './simulationProjects.service';
export * from './validation.service';
import { ValidationService } from './validation.service';
export const APIS = [
  HealthService,
  MetadataService,
  ModelsService,
  SimulationAlgorithmsService,
  SimulationExecutionService,
  SimulationExperimentsService,
  SimulationProjectsService,
  ValidationService,
];
