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

export interface SedAddElementModelChange {
  _type: 'SedAddElementModelChange';
  id: string;
  name?: string;
  target: SedTarget;
  newElements: string[];
}

export interface SedReplaceElementModelChange {
  _type: 'SedReplaceElementModelChange';
  id: string;
  name?: string;
  target: SedTarget;
  newElements: string[];
}

export interface SedRemoveElementModelChange {
  _type: 'SedRemoveElementModelChange';
  id: string;
  name?: string;
  target: SedTarget;
}

export interface SedComputeModelChange {
  _type: 'SedComputeModelChange';
  id: string;
  name?: string;
  target: SedTarget;
  parameters: SedParameter[];
  variables: SedVariable[];
  math: string;
}

export interface SerializedSedComputeModelChange {
  _type: 'SedComputeModelChange';
  id: string;
  name?: string;
  target: SedTarget;
  parameters: SedParameter[];
  variables: SerializedSedVariable[];
  math: string;
}

export type SedModelChange = SedModelAttributeChange | SedAddElementModelChange | SedReplaceElementModelChange | SedRemoveElementModelChange | SedComputeModelChange;
export type SerializedSedModelChange = SedModelAttributeChange | SedAddElementModelChange | SedReplaceElementModelChange | SedRemoveElementModelChange | SerializedSedComputeModelChange;

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

export interface SerializedSedModel {
  _type: 'SedModel';
  id: string;
  name?: string;
  language: string;
  source: string;
  changes: SerializedSedModelChange[];
}

export interface SedAlgorithmParameterChange {
  _type: 'SedAlgorithmParameterChange';
  kisaoId: string;
  newValue: string;
}

export interface SedAlgorithm {
  _type: 'SedAlgorithm';
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
export type SerializedSedSimulation =
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

export interface SerializedSedTask {
  _type: 'SedTask';
  id: string;
  name?: string;
  model: string;
  simulation: string;
}

export interface SedRepeatedTask {
  _type: 'SedRepeatedTask';
  id: string;
  name?: string;
}

export interface SerializedSedRepeatedTask {
  _type: 'SedRepeatedTask';
  id: string;
  name?: string;
}

export type SedAbstractTask = SedTask | SedRepeatedTask;
export type SerializedSedAbstractTask = SerializedSedTask | SerializedSedRepeatedTask;

export interface SedParameter {
  _type: 'SedParameter';
  id: string;
  name?: string;
  value: number;
}

export interface SedVariable {
  _type: 'SedVariable';
  id: string;
  name?: string;
  symbol?: string;
  target?: SedTarget;
  task: SedAbstractTask;
}

export interface SerializedSedVariable {
  _type: 'SedVariable';
  id: string;
  name?: string;
  symbol?: string;
  target?: SedTarget;
  task: string;
}

export interface SedDataGenerator {
  _type: 'SedDataGenerator';
  id: string;
  name?: string;
  parameters: SedParameter[];
  variables: SedVariable[];
  math: string;
}

export interface SerializedSedDataGenerator {
  _type: 'SedDataGenerator';
  id: string;
  name?: string;
  parameters: SedParameter[];
  variables: SerializedSedVariable[];
  math: string;
}

export interface SedDataSet {
  _type: 'SedDataSet';
  id: string;
  dataGenerator: SedDataGenerator;
  name?: string;
  label: string;
}

export interface SerializedSedDataSet {
  _type: 'SedDataSet';
  id: string;
  dataGenerator: string;
  name?: string;
  label: string;
}

export interface SedReport {
  _type: 'SedReport';
  id: string;
  name?: string;
  dataSets: SedDataSet[];
}

export interface SerializedSedReport {
  _type: 'SedReport';
  id: string;
  name?: string;
  dataSets: SerializedSedDataSet[];
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

export interface SerializedSedCurve {
  _type: 'SedCurve';
  id: string;
  name?: string;
  xDataGenerator: string;
  yDataGenerator: string;
}

export interface SedPlot2D {
  _type: 'SedPlot2D';
  id: string;
  name?: string;
  curves: SedCurve[];
  xScale: SedAxisScale;
  yScale: SedAxisScale;
}

export interface SerializedSedPlot2D {
  _type: 'SedPlot2D';
  id: string;
  name?: string;
  curves: SerializedSedCurve[];
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

export interface SerializedSedSurface {
  _type: 'SedSurface';
  id: string;
  name?: string;
  xDataGenerator: string;
  yDataGenerator: string;
  zDataGenerator: string;
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

export interface SerializedSedPlot3D {
  _type: 'SedPlot3D';
  id: string;
  name?: string;
  surfaces: SerializedSedSurface[];
  xScale: SedAxisScale;
  yScale: SedAxisScale;
  zScale: SedAxisScale;
}

export type SedOutput = SedReport | SedPlot2D | SedPlot3D;
export type SerializedSedOutput = SerializedSedReport | SerializedSedPlot2D | SerializedSedPlot3D;

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

export interface SerializedSedDocument {
  _type: 'SedDocument';
  level: number;
  version: number;
  models: SerializedSedModel[];
  simulations: SerializedSedSimulation[];
  tasks: SerializedSedAbstractTask[];
  dataGenerators: SerializedSedDataGenerator[];
  outputs: SerializedSedOutput[];
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

export enum SedElementType {
  SedModel = 'SedModel',
  SedSimulation = 'SedSimulation',
  SedAbstractTask = 'SedAbstractTask',
  SedDataGenerator = 'SedDataGenerator',
  SedOutput = 'SedOutput',
}
