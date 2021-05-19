import {
  IAlgorithm,
  IDependentVariableTargetPattern,
  IEdamOntologyIdVersion,
  IKisaoOntologyId,
  ISboOntologyId,
  ISioOntologyId,
  SoftwareInterfaceType,
} from '@biosimulations/datamodel/common';
import { Citation } from '@biosimulations/datamodel/api';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
export class DependentVariableTargetPattern
  implements IDependentVariableTargetPattern {
  @Prop({ type: String, required: true, default: undefined })
  variables!: string;

  @Prop({ type: String, required: true, default: undefined })
  targetPattern!: string;
}

export const DependentVariableTargetPatternSchema = SchemaFactory.createForClass(
  DependentVariableTargetPattern,
);

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
  dependentDimensions!: ISioOntologyId[] | null;

  @Prop({
    type: [DependentVariableTargetPatternSchema],
    required: true,
    default: undefined,
  })
  dependentVariableTargetPatterns!: DependentVariableTargetPattern[];

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
    type: [EdamOntologyIdVersionSchema],
    _id: false,
    required: true,
    default: undefined,
  })
  simulationFormats!: IEdamOntologyIdVersion[];

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
