import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { prop } from '@typegoose/typegoose';
import { Document } from 'mongoose';
import { Schema as SchemaType } from 'mongoose';
@Schema({ collection: 'Simulation Files' })
export class SimulationFile extends Document {
  @Prop({ type: String })
  originalname!: string;
  @Prop({ type: String })
  encoding!: string;
  @Prop({ type: String })
  mimetype!: string;
  @Prop({ type: Object })
  buffer!: Buffer;
  @Prop({ type: String })
  size!: number;
}

export const SimulationFileSchema: SchemaType<SimulationFile> = SchemaFactory.createForClass(
  SimulationFile
);
SimulationFileSchema.set('strict', 'throw');
