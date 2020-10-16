import {
  IOntologyId,
  Ontologies,
  IEdamOntologyId,
  IKisaoOntologyId,
  ISboOntologyID,
  ISpdxId,
  KisaoIdRegEx,
  SboIdRegEx,
} from '@biosimulations/shared/datamodel';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class OntologyId implements IOntologyId {
  @ApiProperty({ enum: Ontologies, enumName: 'Ontologies' })
  @Prop({ type: String, required: true })
  namespace!: Ontologies;
  @ApiProperty()
  @Prop({ required: true })
  id!: string;
}
export const OntologyIdSchema = SchemaFactory.createForClass(OntologyId);

@Schema({ _id: false })
export class EdamOntologyId implements IEdamOntologyId {
  @ApiProperty({ enum: ['EDAM'] })
  @Prop({ type: String, required: true })
  namespace!: Ontologies.EDAM;
  @ApiProperty({ example: 'format_3973' })
  @Prop({ required: true })
  id!: string;
}
export const EdamOntologyIdSchema = SchemaFactory.createForClass(
  EdamOntologyId
);
@Schema({ _id: false })
export class KisaoOntologyId implements IKisaoOntologyId {
  @ApiProperty({ enum: ['KISAO'] })
  @Prop({
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    validate: (val: string) => val === Ontologies.KISAO,
  })
  namespace!: Ontologies.KISAO;
  @ApiProperty({ example: 'KISAO_0000306' })
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
export class SBOOntologyId implements ISboOntologyID {
  @ApiProperty({ enum: ['SBO'] })
  @Prop({ type: String, required: true })
  namespace!: Ontologies.SBO;
  @ApiProperty({ example: 'SBO_0000004' })
  @Prop({ required: true, validate: SboIdRegEx })
  id!: string;
}
export const SBOOntologyIdSchema = SchemaFactory.createForClass(SBOOntologyId);

@Schema({ _id: false })
export class SpdxId implements ISpdxId {
  @ApiProperty({ enum: ['SPDX'] })
  @Prop({ type: String, required: true })
  namespace!: Ontologies.SPDX;
  @ApiProperty({ example: '0BSD' })
  @Prop({ type: String, required: true })
  id!: string;
}
