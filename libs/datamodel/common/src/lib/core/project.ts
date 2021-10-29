import { SimulationRunSummary } from './simulationRun';

export interface Project {
  id: string;
  simulationRun: string;
  created: string;
  updated: string;
}

export type ProjectInput = Omit<Project, 'created' | 'updated'>;

export interface ProjectSummary {
  id: string;
  simulationRun: SimulationRunSummary;
  created: string;
  updated: string;
}
