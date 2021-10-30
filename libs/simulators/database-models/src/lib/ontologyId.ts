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
  Identifier as IIdentifier,
} from '@biosimulations/datamodel/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
class Identifier implements IIdentifier {
  @Prop({ type: String, required: true, default: undefined })
  namespace!: string;

  @Prop({ type: String, required: true, default: undefined })
  id!: string;

  @Prop({
    type: String,
    required: true,
    default: undefined,
  })
  url!: string;
}
export const IdentifierSchema = SchemaFactory.createForClass(Identifier);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
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
})
class EdamOntologyId implements IEdamOntologyId {
  @Prop({
    type: String,
    required: true,
    enum: [Ontologies.EDAM],
    default: undefined,
  })
  namespace!: Ontologies.EDAM;

  @Prop({
    type: String,
    required: () => true,
    default: () => undefined,
  })
  id!: string;
}

export const EdamOntologyIdSchema =
  SchemaFactory.createForClass(EdamOntologyId);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
class EdamOntologyIdVersion implements IEdamOntologyIdVersion {
  @Prop({
    type: String,
    required: true,
    enum: [Ontologies.EDAM],
    default: undefined,
  })
  namespace!: Ontologies.EDAM;

  @Prop({
    type: String,
    required: () => true,    
    default: () => undefined,
  })
  id!: string;

  @Prop({ type: String, required: false, default: undefined })
  version!: string | null;

  @Prop({ type: [String], required: true, default: undefined })
  supportedFeatures!: string[];
}

export const EdamOntologyIdVersionSchema = SchemaFactory.createForClass(
  EdamOntologyIdVersion,
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
class FunderRegistryOntologyId implements IFunderRegistryOntologyId {
  @Prop({
    type: String,
    enum: [Ontologies.FunderRegistry],
    required: true,
    default: undefined,
  })
  namespace!: Ontologies.FunderRegistry;

  @Prop({
    type: String,
    required: true,
    default: undefined,
  })
  id!: string;
}

export const FunderRegistryOntologyIdSchema = SchemaFactory.createForClass(
  FunderRegistryOntologyId,
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
class LinguistOntologyId implements ILinguistOntologyId {
  @Prop({
    type: String,
    enum: [Ontologies.Linguist],
    required: true,
    default: undefined,
  })
  namespace!: Ontologies.Linguist;

  @Prop({
    type: String,
    required: true,
    default: undefined,
  })
  id!: string;
}

export const LinguistOntologyIdSchema =
  SchemaFactory.createForClass(LinguistOntologyId);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
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
    default: () => undefined,
  })
  id!: string;
}
export const KisaoOntologyIdSchema =
  SchemaFactory.createForClass(KisaoOntologyId);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
class SboOntologyId implements ISboOntologyId {
  @Prop({
    type: String,
    enum: [Ontologies.SBO],
    required: true,
    default: undefined,
  })
  namespace!: Ontologies.SBO;

  @Prop({
    type: String,
    required: () => true,
    default: () => undefined,
  })
  id!: string;
}
export const SboOntologyIdSchema = SchemaFactory.createForClass(SboOntologyId);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
class SioOntologyId implements ISioOntologyId {
  @Prop({
    type: String,
    enum: [Ontologies.SIO],
    required: true,
    default: undefined,
  })
  namespace!: Ontologies.SIO;

  @Prop({
    type: String,
    required: () => true,
    default: () => undefined,
  })
  id!: string;
}
export const SioOntologyIdSchema = SchemaFactory.createForClass(SioOntologyId);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
class SpdxOntologyId implements ISpdxOntologyId {
  @Prop({
    type: String,
    enum: [Ontologies.SPDX],
    required: true,
    default: undefined,
  })
  namespace!: Ontologies.SPDX;

  @Prop({
    type: String,
    required: true,
    default: undefined,
  })
  id!: string;
}
export const SpdxOntologyIdSchema =
  SchemaFactory.createForClass(SpdxOntologyId);
