import { ResourceType } from './resource';
import {
  ChartAttributes,
  ProjectAttributes,
  BiomodelAttributes,
  SimulationAttributes,
  VisualizationAttributes,
  SimulationRunAttributes,
  BiomodelRelationships,
} from '../core';
import { BiosimulationsId } from '../common';

export interface ChartResource {
  type: ResourceType.chart;
  attributes: ChartAttributes;
}
export interface ProjectResource {
  type: ResourceType.project;
  attributes: ProjectAttributes;
}

export interface BiomodelResource {
  type: ResourceType.model;
  id: BiosimulationsId;
  attributes: BiomodelAttributes;
  relationships: BiomodelRelationships;
}
export interface SimulationResource {
  type: ResourceType.simulation;
  attributes: SimulationAttributes;
}
export interface VisualizationResource {
  type: ResourceType.visualization;
  attributes: VisualizationAttributes;
}

export interface SimulationRunResource {
  type: ResourceType.simulationRun;
  attributes: SimulationRunAttributes;
}
