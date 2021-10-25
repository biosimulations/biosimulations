export interface Namespace {
  _type: 'Namespace';
  prefix?: string;
  uri: string;
}

export interface SedTarget {
  _type: 'SedTarget';
  value: string;
  namespaces?: Namespace[];
}

export interface SedModelAttributeChange {
  _type: 'SedModelAttributeChange';
  id: string;
  name?: string;
  target: SedTarget;
  newValue: string;
}

type SedModelChange = SedModelAttributeChange;

export enum ModelLanguage {
  BNGL = 'BNGL',
  CellML = 'CellML',
  LEMS = 'LEMS',
  NeuroML = 'NeuroML',
  RBA = 'RBA',
  SBML = 'SBML',
  Smoldyn = 'Smoldyn',
  XPP = 'XPP',
}

export interface SedModel {
  _type: 'SedModel';
  id: string;
  name?: string;
  language: string;
  source: string;
  changes: SedModelChange[];
}

export interface SedAlgorithmParameterChange {
  kisaoId: string;
  newValue: string;
}

export interface SedAlgorithm {
  kisaoId: string;
  changes: SedAlgorithmParameterChange[];
}

export interface SedUniformTimeCourseSimulation {
  _type: 'SedUniformTimeCourseSimulation';
  id: string;
  name?: string;
  initialTime: number;
  outputStartTime: number;
  outputEndTime: number;
  numberOfSteps: number;
  algorithm: SedAlgorithm;
}

export interface SedSteadyStateSimulation {
  _type: 'SedSteadyStateSimulation';
  id: string;
  name?: string;
  algorithm: SedAlgorithm;
}

export interface SedOneStepSimulation {
  _type: 'SedOneStepSimulation';
  id: string;
  name?: string;
  step: number;
  algorithm: SedAlgorithm;
}

export type SedSimulation =
  | SedUniformTimeCourseSimulation
  | SedSteadyStateSimulation
  | SedOneStepSimulation;

export interface SedTask {
  _type: 'SedTask';
  id: string;
  name?: string;
  model: SedModel;
  simulation: SedSimulation;
}

export interface SedRepeatedTask {
  _type: 'SedRepeatedTask';
  id: string;
  name?: string;
}

export type SedAbstractTask = SedTask | SedRepeatedTask;

export interface SedVariable {
  _type: 'SedVariable';
  id: string;
  name?: string;
  symbol?: string;
  target?: SedTarget;
  task: SedTask;
}

export interface SedDataGenerator {
  _type: 'SedDataGenerator';
  id: string;
  name?: string;
  variables: SedVariable[];
  math: string;
  _resultsDataSetId?: string;
}

export interface SedDataSet {
  _type: 'SedDataSet';
  id: string;
  dataGenerator?: SedDataGenerator;
  name?: string;
  label?: string;
}

export interface SedReport {
  _type: 'SedReport';
  id: string;
  name?: string;
  dataSets: SedDataSet[];
}

export enum SedAxisScale {
  Linear = 'linear',
  Log = 'log',
}

export interface SedCurve {
  _type: 'SedCurve';
  id: string;
  name?: string;
  xDataGenerator: SedDataGenerator;
  yDataGenerator: SedDataGenerator;
}

export interface SedPlot2D {
  _type: 'SedPlot2D';
  id: string;
  name?: string;
  curves: SedCurve[];
  xScale: SedAxisScale;
  yScale: SedAxisScale;
}

export interface SedSurface {
  _type: 'SedSurface';
  id: string;
  name?: string;
  xDataGenerator: SedDataGenerator;
  yDataGenerator: SedDataGenerator;
  zDataGenerator: SedDataGenerator;
}

export interface SedPlot3D {
  _type: 'SedPlot3D';
  id: string;
  name?: string;
  surfaces: SedSurface[];
  xScale: SedAxisScale;
  yScale: SedAxisScale;
  zScale: SedAxisScale;
}

export type SedOutput = SedReport | SedPlot2D | SedPlot3D;

export interface SedDocument {
  _type: 'SedDocument';
  level: number;
  version: number;
  models: SedModel[];
  simulations: SedSimulation[];
  tasks: SedAbstractTask[];
  dataGenerators: SedDataGenerator[];
  outputs: SedOutput[];
}

export interface CombineArchiveContentFile {
  _type: 'CombineArchiveContentFile';
  filename: string;
}

export interface CombineArchiveLocation {
  _type: 'CombineArchiveLocation';
  path: string;
  value: SedDocument | CombineArchiveContentFile;
}

export interface CombineArchiveSedDocSpecsLocation {
  _type: 'CombineArchiveSedDocSpecsLocation';
  path: string;
  value: SedDocument;
}

export interface CombineArchiveContent {
  _type: 'CombineArchiveContent';
  location: CombineArchiveLocation;
  format: string;
  master: boolean;
}

export interface CombineArchiveSedDocSpecsContent {
  _type: 'CombineArchiveSedDocSpecsContent';
  location: CombineArchiveSedDocSpecsLocation;
  format: string;
  master: boolean;
}

export interface CombineArchive {
  _type: 'CombineArchive';
  contents: CombineArchiveContent[];
}

export interface CombineArchiveSedDocSpecs {
  _type: 'CombineArchiveSedDocSpecs';
  contents: CombineArchiveSedDocSpecsContent[];
}

export interface SedDocumentReports {
  _type: 'SedDocument';
  level: number;
  version: number;
  models: SedModel[];
  simulations: SedSimulation[];
  tasks: SedAbstractTask[];
  dataGenerators: SedDataGenerator[];
  outputs: SedReport[];
}

export interface SedDocumentReportsCombineArchiveLocation {
  _type: 'CombineArchiveLocation';
  path: string;
  value: SedDocumentReports;
}

export interface SedDocumentReportsCombineArchiveContent {
  _type: 'CombineArchiveContent';
  location: SedDocumentReportsCombineArchiveLocation;
  format: string;
  master: boolean;
}
