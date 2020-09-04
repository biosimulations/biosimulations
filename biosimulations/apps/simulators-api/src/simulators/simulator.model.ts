import {
  Format as IFormat,
  Person,
  ExternalReferences,
  License,
  KISAOTerm,
  OntologyTerm,
  Algorithm as IAlgorithm,
  JournalReference,
  AlgorithmParameter,
} from '@biosimulations/shared/datamodel';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Format implements IFormat {
  @Prop()
  id!: string;
  @Prop({})
  name!: string;
  @Prop({})
  version!: string;
  @Prop({ required: true })
  edamId!: string;
  @Prop()
  specUrl!: string | null;
  @Prop()
  url!: string | null;
  @Prop()
  mimetype!: string | null;
  @Prop()
  extension!: string | null;
  @Prop()
  sedUrn!: string | null;
}
export const FormatSchema = SchemaFactory.createForClass(Format);
@Schema()
class Algorithm implements IAlgorithm {
  @Prop()
  kisaoId!: string;
  @Prop()
  parameters: AlgorithmParameter[] = [];
  @Prop()
  id!: string;
  @Prop()
  name!: string;
  @Prop()
  ontologyTerms!: OntologyTerm[];
  @Prop()
  modelingFrameworks!: OntologyTerm[];
  @Prop({ type: [FormatSchema] })
  modelFormats!: IFormat[];
  @Prop({ type: [FormatSchema] })
  simulationFormats!: IFormat[];
  @Prop({ type: [FormatSchema] })
  archiveFormats!: IFormat[];
  @Prop({ type: [FormatSchema] })
  references!: JournalReference[];
}
export const AlgorithmSchema = SchemaFactory.createForClass(Algorithm);

@Schema()
export class Simulator extends Document {
  @Prop()
  id!: string;
  @Prop()
  name!: string;
  @Prop()
  version!: string;
  @Prop()
  description!: string;
  @Prop()
  url!: string;
  @Prop()
  image!: string;
  @Prop({ type: FormatSchema })
  format!: IFormat;
  @Prop({ type: Algorithm })
  authors!: Person[];
  @Prop({ type: Object })
  references!: ExternalReferences;
  @Prop({ type: Object })
  license!: License;
  @Prop({ items: AlgorithmSchema, _id: false })
  algorithms!: Algorithm[];
  constructor() {
    super();
  }
}
export const SimulatorSchema = SchemaFactory.createForClass(Simulator);
