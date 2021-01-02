export enum specificationVersions {
  latest = '1.0.0',
  '1.0.0' = '1.0.0',
}

export enum imageVersions {
  latest = '1.0.0',
  '1.0.0' = '1.0.0',
}

export interface ITestCase {
  id: string;
  description: string;
}

export enum TestCaseResultType {
  passed = 'passed',
  skipped = 'skipped',
  failed = 'failed',
}

export interface ITestCaseException {
  category: string;
  message: string;
}

export interface ITestCaseResult {
  case: ITestCase;
  resultType: TestCaseResultType;
  duration: number;
  exception: ITestCaseException | null;
  warnings: ITestCaseException[];
  skipReason: ITestCaseException | null;
  log: string;
}

export interface IValidationTests {
  testSuiteVersion: string;
  results: ITestCaseResult[];
  ghIssue: number;
  ghActionRun: number;
}

export interface IBiosimulatorsMeta {
  specificationVersion: specificationVersions;
  imageVersion: imageVersions;
  validated: boolean;
  validationTests: IValidationTests | null;
}
