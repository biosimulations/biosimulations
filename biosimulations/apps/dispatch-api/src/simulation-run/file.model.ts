import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { prop } from '@typegoose/typegoose';
import { Document } from 'mongoose';
import { Schema as SchemaType } from 'mongoose';

@Schema({ collection: 'Simulation Files' })
export class SimulationFile extends Document {
  @Prop({ type: String, required: true })
  originalname!: string;
  @Prop({ type: String, required: true })
  encoding!: string;
  @Prop({ type: String, required: true })
  mimetype!: string;
  @Prop({ type: Object, required: true })
  buffer!: Buffer;
  @Prop({ type: String, required: true })
  size!: number;
}

export const SimulationFileSchema: SchemaType<SimulationFile> = SchemaFactory.createForClass(
  SimulationFile
);
SimulationFileSchema.set('strict', 'throw');
