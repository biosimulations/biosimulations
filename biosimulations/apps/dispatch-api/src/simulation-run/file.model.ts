/**
 * @file Contains the mongoose model definition for a file stored in the database. The file is saved as a buffer along with metadata. The file must be less than 16mb due to Mongo document size limitations
 * @author Bilal Shaikh
 * @copyright Biosimulations Team, 2020
 * @license MIT
 */
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
