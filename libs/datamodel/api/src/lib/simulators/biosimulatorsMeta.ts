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
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TestCase implements ITestCase {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  public id!: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  public description!: string;
}

export class TestCaseException implements ITestCaseException {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  public category!: string;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  public message!: string;
}

export class TestCaseResult implements ITestCaseResult {
  @ApiProperty({ type: TestCase, required: true })
  @ValidateNested()
  public case!: TestCase;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Result of the execution of the test case',
    enum: TestCaseResultType,
  })
  @IsEnum(TestCaseResultType)
  public resultType!: TestCaseResultType;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  public duration!: number;

  @ApiProperty({ type: TestCaseException, nullable: true, required: true })
  @ValidateNested()
  @IsOptional()
  @Type(() => TestCaseException)
  public exception!: TestCaseException | null;

  @ApiProperty({ type: [TestCaseException], required: true })
  @ValidateNested({ each: true })
  @Type(() => TestCaseException)
  public warnings!: TestCaseException[];

  @ApiProperty({ type: TestCaseException, nullable: true, required: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => TestCaseException)
  public skipReason!: TestCaseException | null;

  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  public log!: string;
}

export class ValidationTests implements IValidationTests {
  @ApiProperty({ type: String, required: true })
  @IsString()
  @IsNotEmpty()
  public testSuiteVersion!: string;

  @ApiProperty({ type: [TestCaseResult], required: true })
  @ValidateNested({ each: true })
  @Type(() => TestCaseResult)
  public results!: TestCaseResult[];

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  public ghIssue!: number;

  @ApiProperty({ type: Number, required: true })
  @IsNumber()
  public ghActionRun!: number;
}

export class BiosimulatorsMeta implements IBiosimulatorsMeta {
  @ApiProperty({
    type: String,
    required: true,
    description:
      'The version of the BioSimulators simulator specifications format that the simulator specifications conforms to',
    enum: specificationVersions,
  })
  @IsEnum(specificationVersions)
  public specificationVersion!: specificationVersions;

  @ApiProperty({
    type: String,
    required: true,
    description:
      'The version of the BioSimulators simulator image format (command-line interface and Docker image structure) that the simulator implements',
    enum: imageVersions,
  })
  @IsEnum(imageVersions)
  public imageVersion!: imageVersions;

  @ApiProperty({
    type: Boolean,
    description:
      'Whether or not the image for the simulator has passed validation',
  })
  @IsBoolean()
  public validated!: boolean;

  @ApiProperty({
    type: ValidationTests,
    nullable: true,
  })
  @ValidateNested()
  @IsOptional()
  @Type(() => ValidationTests)
  public validationTests!: ValidationTests | null;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description:
    //   'When the version of the simulator was catalogued in the BioSimulators registry',
  })
  public created!: Date;

  @ApiResponseProperty({
    type: String,
    format: 'date-time',
    // description:
    //  'When the version of the simulator catalogued in the BioSimulators registry was last updated',
  })
  public updated!: Date;

  public meta: any;
}
