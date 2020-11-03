import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, storeSubdocValidationError: false })
export class BiosimulatorsMeta {
  @Prop({
    type: String,
    required: true,
    default: '1.0.0',
  })
  specificationsVersion!: string;

  @Prop({
    type: String,
    required: true,
    default: '1.0.0',
  })
  imageVersion!: string;
}
export const BiosimulatorsInfoSchema = SchemaFactory.createForClass(
  BiosimulatorsMeta
);
