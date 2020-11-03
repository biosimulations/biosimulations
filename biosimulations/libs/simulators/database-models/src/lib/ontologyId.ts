import {
  IOntologyId,
  Ontologies,
  IEdamOntologyId,
  IKisaoOntologyId,
  ISboOntologyId,
  ISpdxId,
  EdamFormatIdRegEx,
  KisaoIdRegEx,
  SboIdRegEx,
  Identifier as IIdentifier,
} from '@biosimulations/shared/datamodel';

import { edamTerms, kisaoTerms, sboTerms } from '@biosimulations/ontology/sources';
import spdxLicenseList from 'spdx-license-list/full';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, storeSubdocValidationError: false })
class Identifier implements IIdentifier {
  @Prop({ type: String, required: true })
  namespace!: string;
  @Prop({ type: String, required: true })
  id!: string;
  @Prop({ type: String, required: true })
  url!: string;
}
export const IdentifierSchema = SchemaFactory.createForClass(Identifier);
@Schema({ _id: false, storeSubdocValidationError: false })
class OntologyId implements IOntologyId {
  @Prop({
    type: String,
    required: true,
    enum: Object.keys(Ontologies).sort(),
  })
  namespace!: Ontologies;

  @Prop({ type: String, required: true })
  id!: string;
}
export const OntologyIdSchema = SchemaFactory.createForClass(OntologyId);

@Schema({ _id: false, storeSubdocValidationError: false })
class EdamOntologyId implements IEdamOntologyId {
  @Prop({ 
    type: String, 
    enum: [Ontologies[Ontologies.EDAM]],
    required: true,
    uppercase: true,
    trim: true,
  })
  namespace!: Ontologies.EDAM;

  @Prop({
    type: String,
    required: true,
    validate: [
      {
        validator: EdamFormatIdRegEx,
        message: props => `${props.value} is not an id for a valid EDAM format term.`
      },
      {
        validator: function(id: string): boolean {
          return id in edamTerms;
        },
        message: props => `${props.value} is not an id for a valid EDAM term.`
      }
    ],
  })
  id!: string;
}
export const EdamOntologyIdSchema = SchemaFactory.createForClass(
  EdamOntologyId
);
@Schema({ _id: false, storeSubdocValidationError: false })
class KisaoOntologyId implements IKisaoOntologyId {
  @Prop({
    type: String,
    enum: [Ontologies[Ontologies.KISAO]],
    required: true,
    uppercase: true,
    trim: true,
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
        message: props => `${props.value} is not an id for a valid KiSAO term.`
      },
      {
        validator: function(id: string): boolean {
          return id in kisaoTerms;
        },
        message: props => `${props.value} is not an id for a valid KiSAO term.`
      }
    ],
  })
  id!: string;
}
export const KisaoOntologyIdSchema = SchemaFactory.createForClass(
  KisaoOntologyId
);
@Schema({ _id: false, storeSubdocValidationError: false })
class SboOntologyId implements ISboOntologyId {
  @Prop({ 
    type: String,
    enum: [Ontologies[Ontologies.SBO]],
    required: true,
    uppercase: true,
    trim: true,
  })
  namespace!: Ontologies.SBO;

  @Prop({
    type: String,
    required: true,
    validate: [
      {
        validator: SboIdRegEx,
        message: props => `${props.value} is not an id for a valid SBO term.`
      },
      {
        validator: function(id: string): boolean {
          return id in sboTerms;
        },
        message: props => `${props.value} is not an id for a valid SBO term.`
      }
    ],
  })
  id!: string;
}
export const SboOntologyIdSchema = SchemaFactory.createForClass(SboOntologyId);

@Schema({ _id: false, storeSubdocValidationError: false })
class SpdxId implements ISpdxId {
  @Prop({
    type: String,
    enum: [Ontologies[Ontologies.SPDX]],
    required: true,
    uppercase: true,
    trim: true,
  })
  namespace!: Ontologies.SPDX;

  @Prop({
    type: String,
    required: true,
    validate: [
      {
        validator: function(id: string): boolean {
          return id in spdxLicenseList;
        },
        message: props => `${props.value} is not an id for a valid SPDX license.`
      }
    ],
  })
  id!: string;
}
export const SpdxIdSchema = SchemaFactory.createForClass(SpdxId);
