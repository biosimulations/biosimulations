import {
  IOntologyId,
  Ontologies,
  IEdamOntologyId,
  IKisaoOntologyId,
  ISboOntologyID,
  ISpdxId,
} from '@biosimulations/shared/datamodel';
import { ApiProperty } from '@nestjs/swagger';
import { Prop, SchemaFactory } from '@nestjs/mongoose';
export class OntologyId implements IOntologyId {
  @ApiProperty({ enum: Ontologies, enumName: 'Ontologies' })
  @Prop()
  namespace!: Ontologies;
  @ApiProperty()
  @Prop()
  id!: string;
}
export const OntologyIdSchema = SchemaFactory.createForClass(OntologyId);
export class EdamOntologyId implements IEdamOntologyId {
  @ApiProperty({ enum: ['EDAM'] })
  @Prop()
  namespace!: Ontologies.EDAM;
  @ApiProperty({ example: 'format_3973' })
  @Prop({})
  id!: string;
}
export const EdamOntologyIdSchema = SchemaFactory.createForClass(
  EdamOntologyId
);
export class KisaoOntologyId implements IKisaoOntologyId {
  @ApiProperty({ enum: ['KISAO'] })
  @Prop()
  namespace!: Ontologies.KISAO;
  @ApiProperty({ example: 'KISAO:0000306' })
  @Prop()
  id!: string;
}
export const KisaoOntologyIdSchema = SchemaFactory.createForClass(
  KisaoOntologyId
);
export class SBOOntologyId implements ISboOntologyID {
  @ApiProperty({ enum: ['SBO'] })
  @Prop()
  namespace!: Ontologies.SBO;
  @ApiProperty({ example: '0000004' })
  @Prop()
  id!: string;
}
export const SBOOntologyIdSchema = SchemaFactory.createForClass(SBOOntologyId);

export class SpdxOntologyId implements ISpdxId {
  @ApiProperty({ enum: ['SBO'] })
  @Prop()
  namespace!: Ontologies.SPDX;
  @ApiProperty({ example: '0BSD' })
  @Prop()
  id!: string;
}
