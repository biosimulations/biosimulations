import {
  IOntologyId,
  Ontologies,
  IEdamOntologyId,
  IKisaoOntologyId,
  ISboOntologyId,
  ISioOntologyId,
  ISpdxId,
  KisaoIdRegEx,
  SboIdRegEx,
  SioIdRegEx,
  Identifier as IIdentifier,
  EdamFormatIdRegEx,
} from '@biosimulations/datamodel/common';
import { OntologiesService } from '@biosimulations/ontology/ontologies';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import isUrl from 'is-url';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
class Identifier implements IIdentifier {
  @Prop({ type: String, required: true, default: undefined })
  namespace!: string;

  @Prop({ type: String, required: true, default: undefined })
  id!: string;

  @Prop({
    type: String,
    required: true,
    validate: [{
      validator: isUrl,
      message: (props: any): string => `${props.value} is not a valid URL`,
    }],
    default: undefined,
  })
  url!: string;
}
export const IdentifierSchema = SchemaFactory.createForClass(Identifier);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
class OntologyId implements IOntologyId {
  @Prop({
    type: String,
    required: true,
    enum: Object.keys(Ontologies).map((k) => Ontologies[k as Ontologies]),
    default: undefined,
  })
  namespace!: Ontologies;

  @Prop({ type: String, required: true, default: undefined })
  id!: string;
}
export const OntologyIdSchema = SchemaFactory.createForClass(OntologyId);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
class EdamOntologyId implements IEdamOntologyId {
  @Prop({ type: String, required: true, enum: [Ontologies.EDAM], default: undefined })
  namespace!: Ontologies.EDAM;

  @Prop({
    type: String,
    required: true,
    validate: [
      {
        validator: EdamFormatIdRegEx,
        message: (props: any): string => `${props.value} is not an id of an EDAM term`,
      },
      {
        validator: (value: any): boolean => OntologiesService.isTermId(Ontologies.EDAM, value),
        message: (props: any): string => `${props.value} is not an id of an EDAM term`,
      },
    ],
    default: undefined,
  })
  id!: string;
}

export const EdamOntologyIdSchema = SchemaFactory.createForClass(
  EdamOntologyId
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
class KisaoOntologyId implements IKisaoOntologyId {
  @Prop({
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    validate: (val: string) => val === Ontologies.KISAO,
    default: undefined,
  })
  namespace!: Ontologies.KISAO;

  @Prop({
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    validate: [
      { 
        validator: KisaoIdRegEx,
        message: (props: any): string => `${props.value} is not an id of a KiSAO term`,
      },
      { 
        validator: (value: any): boolean => OntologiesService.isTermId(Ontologies.KISAO, value),
        message: (props: any): string => `${props.value} is not an id of a KiSAO term`,
      },
    ],
    default: undefined,
  })
  id!: string;
}
export const KisaoOntologyIdSchema = SchemaFactory.createForClass(
  KisaoOntologyId
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
class SboOntologyId implements ISboOntologyId {
  @Prop({ type: String, required: true, default: undefined })
  namespace!: Ontologies.SBO;

  @Prop({
    type: String,
    required: true,
    validate: [
      { 
        validator: SboIdRegEx,
        message: (props: any): string => `${props.value} is not an id of a SBO term`,
      },
      { 
        validator: (value: any): boolean => OntologiesService.isTermId(Ontologies.SBO, value),
        message: (props: any): string => `${props.value} is not an id of a SBO term`,
      },
    ],
    default: undefined,
  })
  id!: string;
}
export const SboOntologyIdSchema = SchemaFactory.createForClass(SboOntologyId);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
class SioOntologyId implements ISioOntologyId {
  @Prop({ type: String, required: true, default: undefined })
  namespace!: Ontologies.SIO;

  @Prop({
    type: String,
    required: true,
    validate: [
      { 
        validator: SioIdRegEx,
        message: (props: any): string => `${props.value} is not an id of a SIO term`,
      },
      { 
        validator: (value: any): boolean => OntologiesService.isTermId(Ontologies.SIO, value),
        message: (props: any): string => `${props.value} is not an id of a SIO term`,
      },
    ],
    default: undefined,
  })
  id!: string;
}
export const SioOntologyIdSchema = SchemaFactory.createForClass(SioOntologyId);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
class SpdxId implements ISpdxId {
  @Prop({ type: String, required: true, default: undefined })
  namespace!: Ontologies.SPDX;

  @Prop({
    type: String,
    required: true,
    validate: [{
      validator: (value: any): boolean => OntologiesService.isTermId(Ontologies.SPDX, value),
      message: (props: any): string => `${props.value} is not an id of a SPDX term`,
    }],
    default: undefined,
  })
  id!: string;
}
export const SpdxIdSchema = SchemaFactory.createForClass(SpdxId);
