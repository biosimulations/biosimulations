export interface SedModel {
  id: string;
  name: string | null;
  language: string;
  source: string;
}

export interface SedUniformTimeCourseSimulation {
  _type: 'SedUniformTimeCourseSimulation';
  id: string;
  name: string | null;
  initialTime: number;
  outputStartTime: number;
  outputEndTime: number;
  numberOfSteps: number;
}

export interface SedSteadyStateSimulation {
  _type: 'SedSteadyStateSimulation';
  id: string;
  name: string | null;
}

export interface SedOneStepSimulation {
  _type: 'SedOneStepSimulation';
  id: string;
  name: string | null;
  step: number;
}

export type SedSimulation = SedUniformTimeCourseSimulation | SedSteadyStateSimulation | SedOneStepSimulation;

export interface SedTask {
  _type: 'SedTask';
  id: string;
  name: string | null;
  model: SedModel;
  simulation: SedSimulation;
}

export interface SedRepeatedTask {
  _type: 'SedRepeatedTask';
  id: string;
  name: string | null;
}

export type SedAbstractTask = SedTask | SedRepeatedTask;

export interface SedVariable {
  id: string;
  name: string | null;
  symbol: string | null;
  target: string | null;
  task: SedTask;
}

export interface SedDataGenerator {
  id: string;
  name: string | null;
  variables: SedVariable[];
  math: string;
  _resultsDataSetId: string;
}

export interface SedDataSet {
  id: string;
  dataGenerator: SedDataGenerator;
  name: string | null;
  label: string | null;
}

export enum SedOutputType {
  SedReport = 'SedReport',
  SedPlot2D = 'SedPlot2D',
  SedPlot3D = 'SedPlot3D',
}

export interface SedReport {
  _type: SedOutputType.SedReport;
  id: string;
  name: string | null;
  dataSets: SedDataSet[];
}

export enum SedAxisScale {
  linear = 'linear',
  log = 'log',
}

export interface SedCurve {
  id: string;
  name: string | null;
  xDataGenerator: SedDataGenerator;
  yDataGenerator: SedDataGenerator;
}

export interface SedPlot2D {
  _type: SedOutputType.SedPlot2D;
  id: string;
  name: string | null;
  curves: SedCurve[];
  xScale: SedAxisScale;
  yScale: SedAxisScale;
}

export interface SedSurface {
  id: string;
  name: string | null;
  xDataGenerator: SedDataGenerator;
  yDataGenerator: SedDataGenerator;
  zDataGenerator: SedDataGenerator;
}

export interface SedPlot3D {
  _type: SedOutputType.SedPlot3D;
  id: string;
  name: string | null;
  surfaces: SedSurface[];
  xScale: SedAxisScale;
  yScale: SedAxisScale;
  zScale: SedAxisScale;
}

export type SedOutput = SedReport | SedPlot2D | SedPlot3D;

export interface SedDocument {
  level: number;
  version: number;
  models: SedModel[];
  simulations: SedSimulation[];
  tasks: SedAbstractTask[];
  dataGenerators: SedDataGenerator[];
  outputs: SedOutput[];
}

export interface CombineArchiveLocation {
  path: string;
  value: SedDocument;
}

export interface CombineArchiveContent {
  location: CombineArchiveLocation;
  format: string;
  master: boolean;
}

export interface CombineArchive {
  contents: CombineArchiveContent[];
}
