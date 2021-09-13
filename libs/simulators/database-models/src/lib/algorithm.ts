import {
  IModelChangePattern,
  IAlgorithm,
  IOutputVariablePattern,
  IEdamOntologyIdVersion,
  IKisaoOntologyId,
  ISboOntologyId,
  ISioOntologyId,
  SoftwareInterfaceType,
  ModelChangeType,
  SimulationType,
} from '@biosimulations/datamodel/common';
import { Citation } from '@biosimulations/datamodel/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import {
  EdamOntologyIdVersionSchema,
  KisaoOntologyIdSchema,
  SboOntologyIdSchema,
  SioOntologyIdSchema,
} from './ontologyId';

import {
  AlgorithmParameter,
  AlgorithmParameterSchema,
} from './algorithmParameter';

import { DependentPackage, DependentPackageSchema } from './dependentPackage';

import { CitationSchema } from './common';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class ModelChangePattern
  implements IModelChangePattern
{
  @Prop({ type: String, required: true, default: undefined })
  name!: string;

  @Prop({
    type: String,
    enum: Object.entries(ModelChangeType).map(
      (keyVal: [string, string]): string => {
        return keyVal[1];
      },
    ),
    required: true,
    default: undefined,
  })
  type!: ModelChangeType;

  @Prop({ type: String, required: false, default: null })
  target!: string | null;

  @Prop({ type: String, required: false, default: null })
  symbol!: string | null;
}

export const ModelChangePatternSchema =
  SchemaFactory.createForClass(ModelChangePattern);

ModelChangePatternSchema.post('validate', function (doc: Document, next): void {
  const target: string | null = doc.get('target');
  const symbol: string | null = doc.get('symbol');

  if (target === null && symbol === null) {
    doc.invalidate('target', `Model changes must specify at least one of a 'target' or 'symbol'.`);
    doc.invalidate('symbol', `Model changes must specify at least one of a 'target' or 'symbol'.`);
  }

  next();
});

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class OutputVariablePattern
  implements IOutputVariablePattern
{
  @Prop({ type: String, required: true, default: undefined })
  name!: string;

  @Prop({ type: String, required: false, default: null })
  target!: string | null;

  @Prop({ type: String, required: false, default: null })
  symbol!: string | null;
}

export const OutputVariablePatternSchema =
  SchemaFactory.createForClass(OutputVariablePattern);

OutputVariablePatternSchema.post('validate', function (doc: Document, next): void {
  const target: string | null = doc.get('target');
  const symbol: string | null = doc.get('symbol');

  if (target === null && symbol === null) {
    doc.invalidate('target', `Output variables must specify at least one of a 'target' or 'symbol'.`);
    doc.invalidate('symbol', `Output variables must specify at least one of a 'target' or 'symbol'.`);
  }

  next();
});

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class Algorithm implements IAlgorithm {
  @Prop({ type: KisaoOntologyIdSchema, required: true, default: undefined })
  kisaoId!: IKisaoOntologyId;

  @Prop({
    type: [AlgorithmParameterSchema],
    required: false,
    default: undefined,
    validate: [
      {
        validator: (value: AlgorithmParameter[] | null): boolean => {
          if (value == null) {
            return true;
          } else {
            const kisaoIds = new Set();
            for (const parameter of value) {
              const kisaoId = parameter.kisaoId.id;
              if (kisaoIds.has(kisaoId)) {
                return false;
              }
              kisaoIds.add(kisaoId);
            }
            return true;
          }
        },
        message: (props: any): string =>
          'Parameters must be annotated with unique KiSAO terms',
      },
    ],
  })
  parameters!: AlgorithmParameter[] | null;

  @Prop({ type: [SioOntologyIdSchema], required: false, default: undefined })
  outputDimensions!: ISioOntologyId[] | null;

  @Prop({
    type: [OutputVariablePatternSchema],
    required: true,
    default: undefined,
  })
  outputVariablePatterns!: OutputVariablePattern[];

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  id!: string | null;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  name!: string | null;

  @Prop({
    type: [SboOntologyIdSchema],
    _id: false,
    required: true,
    default: undefined,
  })
  modelingFrameworks!: ISboOntologyId[];

  @Prop({
    type: [EdamOntologyIdVersionSchema],
    _id: false,
    required: true,
    default: undefined,
  })
  modelFormats!: IEdamOntologyIdVersion[];

  @Prop({
    type: [ModelChangePatternSchema],
    required: true,
    default: undefined,
  })
  modelChangePatterns!: ModelChangePattern[];

  @Prop({
    type: [EdamOntologyIdVersionSchema],
    _id: false,
    required: true,
    default: undefined,
  })
  simulationFormats!: IEdamOntologyIdVersion[];

  @Prop({
    type: [String],
    enum: Object.entries(SimulationType).map(
      (keyVal: [string, string]): string => {
        return keyVal[1];
      },
    ),
    required: true,
    default: undefined,
  })
  simulationTypes!: SimulationType[];

  @Prop({
    type: [EdamOntologyIdVersionSchema],
    _id: false,
    required: true,
    default: undefined,
  })
  archiveFormats!: IEdamOntologyIdVersion[];

  @Prop({
    type: [String],
    enum: Object.entries(SoftwareInterfaceType).map(
      (keyVal: [string, string]): string => {
        return keyVal[1];
      },
    ),
    required: true,
    default: undefined,
  })
  availableSoftwareInterfaceTypes!: SoftwareInterfaceType[];

  @Prop({
    type: [DependentPackageSchema],
    _id: false,
    required: false,
    default: undefined,
  })
  dependencies!: DependentPackage[] | null;

  @Prop({
    type: [CitationSchema],
    _id: false,
    required: true,
    default: undefined,
  })
  citations!: Citation[];
}

export const AlgorithmSchema = SchemaFactory.createForClass(Algorithm);
