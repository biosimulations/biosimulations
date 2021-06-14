/* eslint-disable @typescript-eslint/explicit-member-accessibility */
export class OutputData {
  id!: string;
  label!: string;
  shape!: string;
  type!: string;
  name!: string;
  values?: string[] | number[] | boolean[];
}
export class Output {
  simId!: string;
  outputId!: string;
  created?: string;
  updated?: string;
  sedmlId!: string;
  name!: string;
  type!: string;
  data!: OutputData[];
}
export class Results {
  simId!: string;
  created!: string;
  updated!: string;
  outputs!: Output[];
}
