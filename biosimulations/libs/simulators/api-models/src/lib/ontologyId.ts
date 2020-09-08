import { OntologyId as IOntology } from '@biosimulations/shared/datamodel';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
export class OntologyId implements IOntology {
  @ApiProperty()
  @Prop()
  ontology!: string;
  @ApiProperty()
  @Prop()
  id!: string;
}
export const OntologyIdSchema = SchemaFactory.createForClass(OntologyId);
export class EdamOntologyId extends OntologyId {
  @ApiProperty({ enum: ['EDAM'] })
  @Prop()
  ontology!: 'EDAM';
  @ApiProperty({ example: 'format_3973' })
  @Prop({})
  id!: string;
}
export const EdamOntologyIdSchema = SchemaFactory.createForClass(
  EdamOntologyId
);
export class KisaoOntologyId extends OntologyId {
  @ApiProperty({ enum: ['KISAO'] })
  @Prop()
  ontology!: 'KISAO';
  @ApiProperty({ example: 'KISAO:0000306' })
  @Prop()
  id!: string;
}
export const KisaoOntologyIdSchema = SchemaFactory.createForClass(
  KisaoOntologyId
);
export class SBOOntologyId extends OntologyId {
  @ApiProperty({ enum: ['SBO'] })
  @Prop()
  ontology!: 'SBO';
  @ApiProperty({ example: 'SBO:0000004' })
  @Prop()
  id!: string;
}
export const SBOOntologyIdSchema = SchemaFactory.createForClass(SBOOntologyId);
