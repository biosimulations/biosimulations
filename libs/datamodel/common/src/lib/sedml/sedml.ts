export interface ClientSedChange {
  _type: SedModelAttributeChangeTypeEnum;
  newValue: string;
  target: ClientSedTarget;
  id?: string;
  name?: string;
}
export enum SedModelAttributeChangeTypeEnum {
  SedModelAttributeChange = 'SedModelAttributeChange',
}

export interface ClientSedTarget {
  _type: SedTargetTypeEnum;
  value: string;
  namespaces?: Array<ClientNamespace>;
}
export enum SedTargetTypeEnum {
  SedTarget = 'SedTarget',
}

export interface ClientNamespace {
  prefix?: string;
  uri: string;
  _type: NamespaceTypeEnum;
}
export enum NamespaceTypeEnum {
  Namespace = 'Namespace',
}

export type SedColor = string;

export enum SedLineStyleType {
  none = 'none',
  solid = 'solid',
  dash = 'dash',
  dot = 'dot',
  dashDot = 'dashDot',
  dashDotDot = 'dashDotDot',
}

export interface SedLineStyle {
  _type: 'SedLineStyle';
  type?: SedLineStyleType;
  color?: SedColor;
  thickness?: number;
}

export enum SedMarkerStyleType {
  none = 'none',
  square = 'square',
  circle = 'circle',
  diamond = 'diamond',
  xCross = 'xCross',
  plus = 'plus',
  star = 'star',
  triangleUp = 'triangleUp',
  triangleDown = 'triangleDown',
  triangleLeft = 'triangleLeft',
  triangleRight = 'triangleRight',
  hDash = 'hDash',
  vDash = 'vDash',
}

export interface SedMarkerStyle {
  _type: 'SedMarkerStyle';
  type?: SedMarkerStyleType;
  size?: number;
  lineColor?: SedColor;
  lineThickness?: number;
  fillColor?: SedColor;
}

export interface SedFillStyle {
  _type: 'SedFillStyle';
  color: SedColor;
}

export interface SedStyle {
  _type: 'SedStyle';
  id: string;
  name?: string;
  base?: SedStyle;
  line?: SedLineStyle;
  marker?: SedMarkerStyle;
  fill?: SedFillStyle;
}

export interface SerializedSedStyle extends Omit<SedStyle, 'base'> {
  base?: string;
}

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
  id?: string;
  name?: string;
  target: SedTarget;
  newValue: string;
}

export interface SedAddElementModelChange {
  _type: 'SedAddElementModelChange';
  id?: string;
  name?: string;
  target: SedTarget;
  newElements: string[];
}

export interface SedReplaceElementModelChange {
  _type: 'SedReplaceElementModelChange';
  id?: string;
  name?: string;
  target: SedTarget;
  newElements: string[];
}

export interface SedRemoveElementModelChange {
  _type: 'SedRemoveElementModelChange';
  id?: string;
  name?: string;
  target: SedTarget;
}

export interface SedComputeModelChange {
  _type: 'SedComputeModelChange';
  id?: string;
  name?: string;
  target: SedTarget;
  parameters: SedParameter[];
  variables: SedVariable[];
  math: string;
}

export interface SerializedSedComputeModelChange extends Omit<SedComputeModelChange, 'variables'> {
  variables: SerializedSedVariable[];
}

export type SedModelChange =
  | SedModelAttributeChange
  | SedAddElementModelChange
  | SedReplaceElementModelChange
  | SedRemoveElementModelChange
  | SedComputeModelChange;
export type SerializedSedModelChange =
  | SedModelAttributeChange
  | SedAddElementModelChange
  | SedReplaceElementModelChange
  | SedRemoveElementModelChange
  | SerializedSedComputeModelChange;

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
  changes: SedModelChange[] | ClientSedChange[];
}

export interface SerializedSedModel extends Omit<SedModel, 'changes'> {
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

export type SedSimulation = SedUniformTimeCourseSimulation | SedSteadyStateSimulation | SedOneStepSimulation;
export type SerializedSedSimulation = SedUniformTimeCourseSimulation | SedSteadyStateSimulation | SedOneStepSimulation;

export interface SedTask {
  _type: 'SedTask';
  id: string;
  name?: string;
  model: SedModel;
  simulation: SedSimulation;
}

export interface SerializedSedTask extends Omit<SedTask, 'model' | 'simulation'> {
  model: string;
  simulation: string;
}

export interface SedSubTask {
  _type: 'SedSubTask';
  task: SedAbstractTask;
  order: number;
}

export interface SedFunctionalRange {
  _type: 'SedFunctionalRange';
  id: string;
  name?: string;
  range: SedRange;
  parameters: SedParameter[];
  variables: SedVariable[];
  math: string;
}

export interface SerializedSedFunctionalRange extends Omit<SedFunctionalRange, 'range' | 'variables'> {
  range: string;
  variables: SerializedSedVariable[];
}

export enum SedUniformRangeType {
  linear = 'linear',
  log = 'log',
}

export interface SedUniformRange {
  _type: 'SedUniformRange';
  id: string;
  name?: string;
  start: number;
  end: number;
  numberOfSteps: number;
  type: SedUniformRangeType;
}

export interface SedVectorRange {
  _type: 'SedVectorRange';
  id: string;
  name?: string;
  values: number[];
}

export type SedRange = SedFunctionalRange | SedUniformRange | SedVectorRange;
export type SerializedSedRange = SerializedSedFunctionalRange | SedUniformRange | SedVectorRange;

export interface SedSetValueComputeModelChange {
  _type: 'SedSetValueComputeModelChange';
  id?: string;
  name?: string;
  model: SedModel;
  target: SedTarget;
  symbol?: string;
  range?: SedRange;
  parameters: SedParameter[];
  variables: SedVariable[];
  math: string;
}

export interface SerializedSedSetValueComputeModelChange
  extends Omit<SedSetValueComputeModelChange, 'model' | 'range' | 'variables'> {
  _type: 'SedSetValueComputeModelChange';
  model: string;
  range?: string;
  variables: SerializedSedVariable[];
}

export interface SerializedSedSubTask extends Omit<SedSubTask, 'task'> {
  task: string;
}

export interface SedRepeatedTask {
  _type: 'SedRepeatedTask';
  id: string;
  name?: string;
  ranges: SedRange[];
  range: SedRange;
  resetModelForEachIteration: boolean;
  changes: SedSetValueComputeModelChange[];
  subTasks: SedSubTask[];
}

export interface SerializedSedRepeatedTask extends Omit<SedRepeatedTask, 'ranges' | 'range' | 'changes' | 'subTasks'> {
  ranges: SerializedSedRange[];
  range: string;
  changes: SerializedSedSetValueComputeModelChange[];
  subTasks: SerializedSedSubTask[];
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
  model?: SedModel;
}

export interface SerializedSedVariable extends Omit<SedVariable, 'task' | 'model'> {
  task: string;
  model?: string;
}

export interface SedDataGenerator {
  _type: 'SedDataGenerator';
  id: string;
  name?: string;
  parameters: SedParameter[];
  variables: SedVariable[];
  math: string;
}

export interface SerializedSedDataGenerator extends Omit<SedDataGenerator, 'variables'> {
  variables: SerializedSedVariable[];
}

export interface SedDataSet {
  _type: 'SedDataSet';
  id: string;
  name?: string;
  label: string;
  dataGenerator: SedDataGenerator;
}

export interface SerializedSedDataSet extends Omit<SedDataSet, 'dataGenerator'> {
  dataGenerator: string;
}

export interface SedReport {
  _type: 'SedReport';
  id: string;
  name?: string;
  dataSets: SedDataSet[];
}

export interface SerializedSedReport extends Omit<SedReport, 'dataSets'> {
  dataSets: SerializedSedDataSet[];
}

export enum SedAxisScale {
  linear = 'linear',
  log = 'log',
}

export interface SedCurve {
  _type: 'SedCurve';
  id: string;
  name?: string;
  xDataGenerator: SedDataGenerator;
  yDataGenerator: SedDataGenerator;
  style?: SedStyle;
}

export interface SerializedSedCurve extends Omit<SedCurve, 'xDataGenerator' | 'yDataGenerator' | 'style'> {
  xDataGenerator: string;
  yDataGenerator: string;
  style?: string;
}

export interface SedPlot2D {
  _type: 'SedPlot2D';
  id: string;
  name?: string;
  curves: SedCurve[];
  xScale: SedAxisScale;
  yScale: SedAxisScale;
}

export interface SerializedSedPlot2D extends Omit<SedPlot2D, 'curves'> {
  curves: SerializedSedCurve[];
}

export interface SedSurface {
  _type: 'SedSurface';
  id: string;
  name?: string;
  xDataGenerator: SedDataGenerator;
  yDataGenerator: SedDataGenerator;
  zDataGenerator: SedDataGenerator;
  style?: SedStyle;
}

export interface SerializedSedSurface
  extends Omit<SedSurface, 'xDataGenerator' | 'yDataGenerator' | 'zDataGenerator' | 'style'> {
  xDataGenerator: string;
  yDataGenerator: string;
  zDataGenerator: string;
  style?: string;
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

export interface SerializedSedPlot3D extends Omit<SedPlot3D, 'surfaces'> {
  surfaces: SerializedSedSurface[];
}

export type SedOutput = SedReport | SedPlot2D | SedPlot3D;
export type SerializedSedOutput = SerializedSedReport | SerializedSedPlot2D | SerializedSedPlot3D;

export interface SedDocument {
  _type: 'SedDocument';
  level: number;
  version: number;
  styles: SedStyle[];
  models: SedModel[];
  simulations: SedSimulation[];
  tasks: SedAbstractTask[];
  dataGenerators: SedDataGenerator[];
  outputs: SedOutput[];
}

export interface SerializedSedDocument
  extends Omit<SedDocument, 'styles' | 'models' | 'simulations' | 'tasks' | 'dataGenerators' | 'outputs'> {
  styles: SerializedSedStyle[];
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

export interface CombineArchiveContent {
  _type: 'CombineArchiveContent';
  location: CombineArchiveLocation;
  format: string;
  master: boolean;
}

export interface CombineArchive {
  _type: 'CombineArchive';
  contents: CombineArchiveContent[];
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
