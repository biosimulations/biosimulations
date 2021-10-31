import { SimulationRunSummary } from './simulationRun';

export interface Project {
  id: string;
  simulationRun: string;
  created: string;
  updated: string;
}

export interface ProjectInput extends Omit<Project, 'created' | 'updated'> {
  owner?: string;
}

export interface ProjectSummary {
  id: string;
  simulationRun: SimulationRunSummary;
  created: string;
  updated: string;
}
