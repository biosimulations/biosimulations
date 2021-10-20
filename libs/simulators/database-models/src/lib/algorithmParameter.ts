/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import {
  ValueType,
  AlgorithmParameter as IAlgorithmParameter,
  SoftwareInterfaceType,
  Ontologies,
} from '@biosimulations/datamodel/common';
import { KisaoOntologyIdSchema } from './ontologyId';
import { IKisaoOntologyId } from '@biosimulations/datamodel/common';
import { OntologiesService } from '@biosimulations/ontology/ontologies';
import { validateValue } from '@biosimulations/datamodel/utils';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class AlgorithmParameter implements IAlgorithmParameter {
  @Prop({ type: KisaoOntologyIdSchema, required: true, default: undefined })
  kisaoId!: IKisaoOntologyId;

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
    type: String,
    enum: Object.keys(ValueType).map((k) => ValueType[k as ValueType]),
    required: true,
    default: undefined,
  })
  type!: ValueType;

  @Prop({ type: String, required: false, default: undefined })
  value!: string | null;

  @Prop({ type: [String], required: false, default: undefined })
  recommendedRange!: string[] | null;

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
}

export const AlgorithmParameterSchema =
  SchemaFactory.createForClass(AlgorithmParameter);

AlgorithmParameterSchema.post('validate', function (doc: Document, next): void {
  const type: ValueType = doc.get('type');

  const isKisaoId = (id: string): boolean => {
    return OntologiesService.isTermId(Ontologies.KISAO, id);
  };

  const value: string | null = doc.get('value');
  if (value != null && !validateValue(value, type, isKisaoId)) {
    doc.invalidate('value', `value '${value}' must be an instance of ${type}`);
  }

  const recommendedRange: string[] | null = doc.get('recommendedRange');
  if (recommendedRange != null) {
    for (let iRange = 0; iRange < recommendedRange.length; iRange++) {
      const value = recommendedRange[iRange];
      if (!validateValue(value, type, isKisaoId)) {
        doc.invalidate(
          `recommendedRange/${iRange}`,
          `element of recommendedRange '${value}' must be an instance of ${type}`,
        );
      }
    }
  }

  next();
});
