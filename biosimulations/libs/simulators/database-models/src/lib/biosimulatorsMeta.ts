import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, storeSubdocValidationError: false })
export class BiosimulatorsMeta {
  @Prop({ required: true, default: '1.0.0' })
  schemaVersion!: string;

  @Prop({ default: '1.0.0' })
  imageVersion!: string;

  @Prop()
  internal?: boolean;
}
export const BiosimulatorsInfoSchema = SchemaFactory.createForClass(
  BiosimulatorsMeta
);
