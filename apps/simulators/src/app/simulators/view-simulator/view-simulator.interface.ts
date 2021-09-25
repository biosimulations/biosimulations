import { Observable } from 'rxjs';
import {
  Url,
  IImage,
  IPythonApi,
  DependentPackage,
  ILinguistOntologyId,
  IOutputVariablePattern,
  ITestCase,
  ITestCaseException,
  IModelTarget,
  IModelSymbol,
  ModelChangeType,
  ModelChangeTypeName,
  SimulationType,
  SimulationTypeName,
} from '@biosimulations/datamodel/common';

export interface ViewModelChangeTypeValueName {
  value: ModelChangeType;
  name: ModelChangeTypeName;
}

export interface ViewModelChangePattern {
  name: string;
  types: ViewModelChangeTypeValueName[];
  target: IModelTarget | null;
  symbol: IModelSymbol | null;
}

export interface ViewSimulationTypeValueName {
  value: SimulationType;
  name: SimulationTypeName;
}

export interface ViewAlgorithm {
  kisaoId: string;
  heading: string;
  name: string;
  description: DescriptionFragment[] | null;
  kisaoUrl: string;
  modelingFrameworks: ViewFramework[];
  modelFormats: ViewFormat[];
  modelChangePatterns: ViewModelChangePattern[];
  simulationFormats: ViewFormat[];
  simulationTypes: ViewSimulationTypeValueName[];
  archiveFormats: ViewFormat[];
  parameters: ViewParameter[] | null;
  outputDimensions: ViewSioId[] | null;
  outputVariablePatterns: IOutputVariablePattern[];
  citations: ViewCitation[];
  availableSoftwareInterfaceTypes: string[];
  dependencies: DependentPackage[] | null;
}

export interface ViewAlgorithmObservable {
  kisaoId: string;
  heading: Observable<string>;
  name: Observable<string>;
  description: Observable<DescriptionFragment[] | null>;
  kisaoUrl: Observable<string>;
  modelingFrameworks: Observable<ViewFramework>[];
  modelFormats: ViewFormatObservable[];
  modelChangePatterns: ViewModelChangePattern[];
  simulationFormats: ViewFormatObservable[];
  simulationTypes: ViewSimulationTypeValueName[];
  archiveFormats: ViewFormatObservable[];
  parameters: ViewParameterObservable[] | null;
  outputDimensions: Observable<ViewSioId>[] | null;
  outputVariablePatterns: IOutputVariablePattern[];
  citations: ViewCitation[];
  availableSoftwareInterfaceTypes: string[];
  dependencies: DependentPackage[] | null;
}

export enum DescriptionFragmentType {
  text = 'text',
  href = 'href',
}

export interface DescriptionFragment {
  type: DescriptionFragmentType;
  value: string;
}

export interface ViewFramework {
  id: string;
  name: string;
  url: string;
}

export interface ViewFormat {
  term: ViewFormatTerm;
  version: string | null;
  supportedFeatures: string[];
}

export interface ViewFormatObservable {
  term: Observable<ViewFormatTerm>;
  version: string | null;
  supportedFeatures: string[];
}

export interface ViewFormatTerm {
  id: string;
  name: string;
  url: string;
}

export interface ViewKisaoTerm {
  id: string;
  name: string;
  url: string;
}

export interface ViewParameter {
  name: string;
  type: string;
  rawValue: string | null;
  value: boolean | number | string | null;
  valueUrl: string | null;
  formattedValue: string | null;
  rawRange: string[] | null;
  range: (boolean | number | string)[] | null;
  formattedRange: string[] | null;
  formattedKisaoRange: ViewKisaoTerm[] | null;
  kisaoId: string;
  kisaoUrl: string;
  availableSoftwareInterfaceTypes: string[];
}

export interface ViewParameterObservable {
  name: Observable<string>;
  type: string;
  rawValue: string | null;
  value: boolean | number | string | Observable<string> | null;
  valueUrl: string | null;
  formattedValue: string | null;
  rawRange: string[] | null;
  range: (boolean | number | string | Observable<string>)[] | null;
  formattedRange: string[] | null;
  formattedKisaoRange: ViewKisaoTerm[] | null;
  kisaoId: string;
  kisaoUrl: string;
  availableSoftwareInterfaceTypes: string[];
}

export interface ViewSioId {
  id: string;
  name: string;
  url: string;
}

export interface ViewIdentifier {
  text: string;
  url: string;
}

export interface ViewCitation {
  url: string | null;
  text: string;
}

export interface ViewVersion {
  label: string;
  created: string;
  image: IImage | null;
  curationStatus: string;
  validated: boolean;
}

export interface ViewAuthor {
  name: string;
  orcidUrl: string | null;
}

export interface ViewFunding {
  funderName: Observable<string>;
  funderUrl: Observable<string>;
  grant: string | null;
  url: string | null;
}

export interface ViewTestCaseResult {
  case: ITestCase;
  caseUrl: string;
  caseClass: string;
  caseArchive: string | null;
  caseArchiveUrl: string | null;
  resultType: string;
  duration: string;
  exception: ITestCaseException | null;
  warnings: ITestCaseException[];
  skipReason: ITestCaseException | null;
  log: string;
}

export interface ViewValidationTests {
  testSuiteVersion: string;
  testSuiteVersionUrl: string;
  numTests: number;
  numTestsPassed: number;
  numTestPassedWithWarnings: number;
  numTestsSkipped: number;
  numTestsFailed: number;
  results: ViewTestCaseResult[];
  ghIssue: number;
  ghIssueUrl: string;
  ghActionRun: number;
  ghActionRunUrl: string;
}

export interface ViewSimulator {
  _json: string;
  id: string;
  version: string;
  name: string;
  description: string | null;
  image: IImage | null;
  pythonApi: IPythonApi | null;
  urls: Url[];
  licenseUrl: Observable<string> | null;
  licenseName: Observable<string> | null;
  authors: ViewAuthor[];
  identifiers: ViewIdentifier[];
  citations: ViewCitation[];
  algorithms: Observable<ViewAlgorithm[]>;
  otherInterfaceTypes: string[];
  supportedOperatingSystemTypes: string[];
  supportedProgrammingLanguages: ILinguistOntologyId[];
  versions: Observable<ViewVersion[]>;
  curationStatus: string;
  funding: ViewFunding[];
  created: string;
  updated: string;
  validated: boolean;
  validationTests: Observable<ViewValidationTests | null>;
}
