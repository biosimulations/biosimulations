/* eslint-disable @typescript-eslint/explicit-member-accessibility */
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
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class TestCase implements ITestCase {
  @Prop({ type: String, required: true, default: undefined })
  id!: string;

  @Prop({ type: String, required: true, default: undefined })
  description!: string;
}

export const TestCaseSchema = SchemaFactory.createForClass(TestCase);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class TestCaseException implements ITestCaseException {
  @Prop({ type: String, required: true, default: undefined })
  category!: string;

  @Prop({ type: String, required: true, default: undefined })
  message!: string;
}

export const TestCaseExceptionSchema =
  SchemaFactory.createForClass(TestCaseException);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class TestCaseResult implements ITestCaseResult {
  @Prop({ type: TestCaseSchema, required: true, default: undefined })
  case!: TestCase;

  @Prop({
    type: String,
    required: true,
    enum: Object.keys(TestCaseResultType).map(
      (k) => TestCaseResultType[k as TestCaseResultType],
    ),
    default: undefined,
  })
  resultType!: TestCaseResultType;

  @Prop({ type: Number, required: true, default: undefined })
  duration!: number;

  @Prop({ type: TestCaseExceptionSchema, required: false, default: undefined })
  exception!: TestCaseException | null;

  @Prop({ type: [TestCaseExceptionSchema], required: true, default: undefined })
  warnings!: TestCaseException[];

  @Prop({ type: TestCaseExceptionSchema, required: false, default: undefined })
  skipReason!: TestCaseException | null;

  @Prop({ type: String, required: false, default: '' })
  log!: string;
}

export const TestCaseResultSchema =
  SchemaFactory.createForClass(TestCaseResult);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class ValidationTests implements IValidationTests {
  @Prop({ type: String, required: true, default: undefined })
  testSuiteVersion!: string;

  @Prop({ type: [TestCaseResultSchema], required: true, default: undefined })
  results!: TestCaseResult[];

  @Prop({ type: Number, required: true, default: undefined })
  ghIssue!: number;

  @Prop({ type: Number, required: true, default: undefined })
  ghActionRun!: number;
}

export const ValidationTestsSchema =
  SchemaFactory.createForClass(ValidationTests);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class BiosimulatorsMeta implements IBiosimulatorsMeta {
  @Prop({
    type: String,
    required: true,
    default: specificationVersions.latest,
    enum: Object.keys(specificationVersions).map(
      (k) => specificationVersions[k as specificationVersions],
    ),
  })
  specificationVersion!: specificationVersions;

  @Prop({
    type: String,
    required: true,
    enum: Object.keys(imageVersions).map(
      (k) => imageVersions[k as imageVersions],
    ),
    default: imageVersions.latest,
  })
  imageVersion!: imageVersions;

  @Prop({ type: Object, required: false, default: null })
  meta: any;

  @Prop({ type: Boolean, required: true, default: undefined })
  validated!: boolean;

  @Prop({ type: ValidationTestsSchema, required: false, default: undefined })
  validationTests!: ValidationTests | null;

  created!: Date;

  updated!: Date;
}

export const BiosimulatorsMetaSchema =
  SchemaFactory.createForClass(BiosimulatorsMeta);

BiosimulatorsMetaSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated',
});
