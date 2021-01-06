import {
  IOntologyId,
  Ontologies,
  IEdamOntologyId,
  IEdamOntologyIdVersion,
  IFunderRegistryOntologyId,
  ILinguistOntologyId,
  IKisaoOntologyId,
  ISboOntologyId,
  ISioOntologyId,
  ISpdxOntologyId,
  KisaoIdRegEx,
  SboIdRegEx,
  SioIdRegEx,
  Identifier as IIdentifier,
  EdamFormatIdRegEx,
} from '@biosimulations/datamodel/common';
import { OntologiesService } from '@biosimulations/ontology/ontologies';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import isUrl from 'is-url';
import { SchemaDefinition } from 'mongoose';

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
    required: () => true,
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
    default: () => undefined,
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
class EdamOntologyIdVersion implements IEdamOntologyIdVersion {
  @Prop({ type: String, required: true, enum: [Ontologies.EDAM], default: undefined })
  namespace!: Ontologies.EDAM;

  @Prop({
    type: String,
    required: () => true,
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
    default: () => undefined,
  })
  id!: string;

  @Prop({ type: String, required: false, default: undefined })
  version!: string | null;

  @Prop({ type: [String], required: true, default: undefined })
  supportedFeatures!: string[];
}

export const EdamOntologyIdVersionSchema = SchemaFactory.createForClass(
  EdamOntologyIdVersion
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
class FunderRegistryOntologyId implements IFunderRegistryOntologyId {
  @Prop({ type: String, enum: [Ontologies.FunderRegistry], required: true, default: undefined })
  namespace!: Ontologies.FunderRegistry;

  @Prop({
    type: String,
    required: true,
    validate: [{
      validator: (value: any): boolean => OntologiesService.isTermId(Ontologies.FunderRegistry, value),
      message: (props: any): string => `${props.value} is not an id of a Funder Registry term`,
    }],
    default: undefined,
  })
  id!: string;
}

export const FunderRegistryOntologyIdSchema = SchemaFactory.createForClass(FunderRegistryOntologyId);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
class LinguistOntologyId implements ILinguistOntologyId {
  @Prop({ type: String, enum: [Ontologies.Linguist], required: true, default: undefined })
  namespace!: Ontologies.Linguist;

  @Prop({
    type: String,
    required: true,
    validate: [{
      validator: (value: any): boolean => OntologiesService.isTermId(Ontologies.Linguist, value),
      message: (props: any): string => `${props.value} is not an id of a Linguist term`,
    }],
    default: undefined,
  })
  id!: string;
}

export const LinguistOntologyIdSchema = SchemaFactory.createForClass(LinguistOntologyId);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
class KisaoOntologyId implements IKisaoOntologyId {
  @Prop({
    type: String,
    enum: [Ontologies.KISAO],
    required: true,
    default: undefined,
  })
  namespace!: Ontologies.KISAO;

  @Prop({
    type: String,
    required: () => true,
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
    default: () => undefined,
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
  @Prop({ type: String, enum: [Ontologies.SBO], required: true, default: undefined })
  namespace!: Ontologies.SBO;

  @Prop({
    type: String,
    required: () => true,
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
    default: () => undefined,
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
  @Prop({ type: String, enum: [Ontologies.SIO], required: true, default: undefined })
  namespace!: Ontologies.SIO;

  @Prop({
    type: String,
    required: () => true,
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
    default: () => undefined,
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
class SpdxOntologyId implements ISpdxOntologyId {
  @Prop({ type: String, enum: [Ontologies.SPDX], required: true, default: undefined })
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
export const SpdxOntologyIdSchema = SchemaFactory.createForClass(SpdxOntologyId);
