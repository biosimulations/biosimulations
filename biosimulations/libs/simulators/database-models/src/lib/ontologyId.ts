import {
  IOntologyId,
  Ontologies,
  IEdamOntologyId,
  IKisaoOntologyId,
  ISboOntologyId,
  ISpdxId,
  KisaoIdRegEx,
  SboIdRegEx,
} from '@biosimulations/shared/datamodel';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
class OntologyId implements IOntologyId {
  @Prop({ type: String, required: true })
  namespace!: Ontologies;

  @Prop({ required: true })
  id!: string;
}
export const OntologyIdSchema = SchemaFactory.createForClass(OntologyId);

@Schema({ _id: false })
class EdamOntologyId implements IEdamOntologyId {
  @Prop({ type: String, required: true })
  namespace!: Ontologies.EDAM;

  @Prop({ required: true })
  id!: string;
}
export const EdamOntologyIdSchema = SchemaFactory.createForClass(
  EdamOntologyId
);
@Schema({ _id: false })
class KisaoOntologyId implements IKisaoOntologyId {
  @Prop({
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    validate: (val: string) => val === Ontologies.KISAO,
  })
  namespace!: Ontologies.KISAO;

  @Prop({
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    validate: KisaoIdRegEx,
  })
  id!: string;
}
export const KisaoOntologyIdSchema = SchemaFactory.createForClass(
  KisaoOntologyId
);
@Schema({ _id: false })
class SboOntologyId implements ISboOntologyId {
  @Prop({ type: String, required: true })
  namespace!: Ontologies.SBO;

  @Prop({ required: true, validate: SboIdRegEx })
  id!: string;
}
export const SboOntologyIdSchema = SchemaFactory.createForClass(SboOntologyId);

@Schema({ _id: false })
class SpdxId implements ISpdxId {
  @Prop({ type: String, required: true })
  namespace!: Ontologies.SPDX;

  @Prop({ type: String, required: true })
  id!: string;
}
export const SpdxIdSchema = SchemaFactory.createForClass(SpdxId);
