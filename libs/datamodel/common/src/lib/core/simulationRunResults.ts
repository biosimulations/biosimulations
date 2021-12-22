export type SimulationRunOutputDatumElement = number | boolean | string | SimulationRunOutputDatumElement[];

export interface SimulationRunOutputDatum {
  id: string;
  label: string;
  name?: string;
  shape: string;
  type: string;
  values: SimulationRunOutputDatumElement[];
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
