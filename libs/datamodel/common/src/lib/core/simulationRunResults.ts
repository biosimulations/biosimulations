export interface SimulationRunOutputDatum {
  id: string;
  label: string;
  name?: string;
  shape: string;
  type: string;
  values: (number | boolean | string)[];
}

export type SimulationRunOutputData = SimulationRunOutputDatum[];

export interface SimulationRunOutput {
  simId: string;
  outputId: string;
  type: string;
  name: string;
  created: string;
  updated: string;
  data: SimulationRunOutputData;
}

export interface SimulationRunResults {
  simId: string;
  created: string;
  updated: string;
  outputs: SimulationRunOutput[];
}
