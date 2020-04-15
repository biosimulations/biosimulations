import { PrimaryResourceDTO, ResourceType } from './resource';
import {
  ChartAttributes,
  ProjectAttributes,
  BiomodelAttributes,
  SimulationAttributes,
  VisualizationAttributes,
  SimulationRunAttributes,
} from '../core';
import { VisualizationId } from '../common';

export interface ChartResourceDTO extends PrimaryResourceDTO {
  type: ResourceType.chart;
  attributes: ChartAttributes;
}
export interface ProjectResourceDTO extends PrimaryResourceDTO {
  type: ResourceType.project;
  attributes: ProjectAttributes;
}

export interface BiomodelResourceDTO extends PrimaryResourceDTO {
  type: ResourceType.model;
  attributes: BiomodelAttributes;
}
export interface SimulationResourceDTO extends PrimaryResourceDTO {
  type: ResourceType.simulation;
  attributes: SimulationAttributes;
}
export interface VisualizationResourceDTO extends PrimaryResourceDTO {
  type: ResourceType.visualization;
  attributes: VisualizationAttributes;
}

export interface SimulationRunResourceDTO extends PrimaryResourceDTO {
  type: ResourceType.simulationRun;
  attributes: SimulationRunAttributes;
}
