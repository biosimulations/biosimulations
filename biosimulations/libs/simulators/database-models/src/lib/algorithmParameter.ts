import {
  ValueType,
  AlgorithmParameter as IAlgorithmParameter,
  SoftwareInterfaceType,
  Ontologies,
} from '@biosimulations/datamodel/common';
import { KisaoOntologyIdSchema } from './ontologyId';
import { IKisaoOntologyId } from '@biosimulations/datamodel/common';
import { OntologiesService } from '@biosimulations/ontology/ontologies';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
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

export const AlgorithmParameterSchema = SchemaFactory.createForClass(
  AlgorithmParameter,
);

AlgorithmParameterSchema.post('validate', function (doc: Document, next): void {
  const type: ValueType = doc.get('type');

  const value: string | null = doc.get('value');
  if (value != null && !validateValue(value, type)) {
    doc.invalidate('value', `value '${value}' must be an instance of ${type}`);
  }

  const recommendedRange: string[] | null = doc.get('recommendedRange');
  if (recommendedRange != null) {
    for (let iRange = 0; iRange < recommendedRange.length; iRange++) {
      const value = recommendedRange[iRange];
      if (!validateValue(value, type)) {
        doc.invalidate(
          `recommendedRange/${iRange}`,
          `element of recommendedRange '${value}' must be an instance of ${type}`,
        );
      }
    }
  }

  next();
});

export function parseValue(value: string, type: ValueType): any {
  let parsedValue: any;
  switch (type) {
    case ValueType.boolean: {
      const lowerValue = value.toLowerCase();
      if (lowerValue === 'true' || lowerValue === '1') {
        return true;
      }
      if (lowerValue === 'false' || lowerValue === '0') {
        return false;
      }
      throw new Error(`value '${value}' must be an instance of ${type}`);
      break;
    }
    case ValueType.integer: {
      parsedValue = parseInt(value);
      if (isNaN(parsedValue) || parsedValue !== parseFloat(value)) {
        throw new Error(`value '${value}' must be an instance of ${type}`);
      }
      return parsedValue;
    }
    case ValueType.float: {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        throw new Error(`value '${value}' must be an instance of ${type}`);
      }
      return parsedValue;
    }
    case ValueType.string: {
      return value;
    }
    case ValueType.kisaoId: {
      if (OntologiesService.isTermId(Ontologies.KISAO, value)) {
        return value;
      }
      throw new Error(`value '${value}' must be an instance of ${type}`);
    }
    case ValueType.list: {
      try {
        parsedValue = JSON.parse(value);
        if (Array.isArray(parsedValue)) {
          return parsedValue;
        } else {
          throw new Error(`value '${value}' must be an instance of ${type}`);
        }
      } catch {
        throw new Error(`value '${value}' must be an instance of ${type}`);
      }
    }
    case ValueType.object: {
      try {
        parsedValue = JSON.parse(value);
        if (
          parsedValue != null &&
          typeof parsedValue !== 'string' &&
          typeof parsedValue !== 'number' &&
          !Array.isArray(parsedValue)
        ) {
          return parsedValue;
        } else {
          throw new Error(`value '${value}' must be an instance of ${type}`);
        }
      } catch {
        throw new Error(`value '${value}' must be an instance of ${type}`);
      }
      throw new Error(`value '${value}' must be an instance of ${type}`);
    }
    case ValueType.any: {
      try {
        return JSON.parse(value);
      } catch {
        throw new Error(`value '${value}' must be an instance of ${type}`);
      }
    }
    default: {
      throw new Error(`type '${type}' is not supported`);
    }
  }
}

export function validateValue(value: string, type: ValueType): boolean {
  let parsedValue: any;
  switch (type) {
    case ValueType.boolean: {
      return ['true', 'false', '1', '0'].includes(value.toLowerCase());
    }
    case ValueType.integer: {
      parsedValue = parseInt(value);
      return !isNaN(parsedValue) && parsedValue === parseFloat(value);
    }
    case ValueType.float: {
      return !isNaN(parseFloat(value));
    }
    case ValueType.string: {
      return true;
    }
    case ValueType.kisaoId: {
      return OntologiesService.isTermId(Ontologies.KISAO, value);
    }
    case ValueType.list: {
      try {
        return Array.isArray(JSON.parse(value));
      } catch {
        return false;
      }
    }
    case ValueType.object: {
      try {
        parsedValue = JSON.parse(value);
        return (
          parsedValue != null &&
          typeof parsedValue !== 'string' &&
          typeof parsedValue !== 'number' &&
          !Array.isArray(parsedValue)
        );
      } catch {
        return false;
      }
    }
    case ValueType.any: {
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }
    default: {
      throw new Error(`type '${type}' is not supported`);
    }
  }
}
