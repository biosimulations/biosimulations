import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class SimulationIdMap extends Document {
    @Prop({required: true})
    uuid: string;

    @Prop({required: true})
    projectName: string;
}

export const SimulationIdMapSchema = SchemaFactory.createForClass(SimulationIdMap);
