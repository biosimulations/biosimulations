import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  IBiosimulatorsMeta,
  imageVersions,
  specificationVersions,
  IValidationTests,
  ITestCaseResult,
  ITestCase,
  TestCaseResultType,
  ITestCaseException,
} from '@biosimulations/datamodel/common';

export class TestCase implements ITestCase {
  @ApiProperty({ type: String, required: true })
  id!: string;

  @ApiProperty({ type: String, required: true })
  description!: string;
}

export class TestCaseException implements ITestCaseException {
  @ApiProperty({ type: String, required: true })
  category!: string;

  @ApiProperty({ type: String, required: true })
  message!: string;
}

export class TestCaseResult implements ITestCaseResult {
  @ApiProperty({ type: TestCase, required: true })
  case!: TestCase;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Result of the execution of the test case',
    enum: TestCaseResultType,
  })
  resultType!: TestCaseResultType;

  @ApiProperty({ type: Number, required: true })
  duration!: number;

  @ApiProperty({ type: TestCaseException, nullable: true, required: true })
  exception!: TestCaseException | null;

  @ApiProperty({ type: [TestCaseException], required: true })
  warnings!: TestCaseException[];

  @ApiProperty({ type: TestCaseException, nullable: true, required: true })
  skipReason!: TestCaseException | null;

  @ApiProperty({ type: String, required: true })
  log!: string;
}

export class ValidationTests implements IValidationTests {
  @ApiProperty({ type: String, required: true })
  testSuiteVersion!: string;

  @ApiProperty({ type: [TestCaseResult], required: true })
  results!: TestCaseResult[];

  @ApiProperty({ type: Number, required: true })
  ghIssue!: number;

  @ApiProperty({ type: Number, required: true })
  ghActionRun!: number;
}

export class BiosimulatorsMeta implements IBiosimulatorsMeta {
  meta: any;
  @ApiProperty({
    type: String,
    required: true,
    description:
      'The version of the BioSimulators simulator specifications format that the simulator specifications conforms to',
    enum: specificationVersions,
  })
  specificationVersion!: specificationVersions;

  @ApiProperty({
    type: String,
    required: true,
    description:
      'The version of the BioSimulators simulator image format (command-line interface and Docker image structure) that the simulator implements',
    enum: imageVersions,
  })
  imageVersion!: imageVersions;

  @ApiProperty({
    type: Boolean,
    description:
      'Whether or not the image for the simulator has passed validation',
  })
  validated!: boolean;

  @ApiProperty({
    type: ValidationTests,
    nullable: true,
  })
  validationTests!: ValidationTests | null;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description:
    //   'When the version of the simulator was catalogued in the BioSimulators registry',
  })
  created!: Date;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description:
    //  'When the version of the simulator catalogued in the BioSimulators registry was last updated',
  })
  updated!: Date;
}
