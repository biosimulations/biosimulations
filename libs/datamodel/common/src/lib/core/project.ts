export interface Project {
  id: string;
  simulationRun: string;
  created: string;
  updated: string;
}

export type ProjectInput = Omit<Project, 'created' | 'updated'>;
