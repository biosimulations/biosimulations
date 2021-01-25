import {
  CombineArchiveLog,
  SimulationRun
} from '@biosimulations/dispatch/api-models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import {
  omitPrivate,
  ObjectIdValidator
} from '@biosimulations/datamodel/common';

@Schema({ collection: 'Simulation Run Logs' })
export class SimulationRunLog extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: SimulationRun.name,
    validate: ObjectIdValidator,
    unique: true,
    index: true
  })
  simId!: string;

  @Prop({ type: Object })
  log!: CombineArchiveLog;

  @Prop({ type: String, text: true })
  stdOut!: string;

  @Prop()
  created!: Date;

  @Prop()
  updated!: Date;
}
export const LogSchema = SchemaFactory.createForClass(SimulationRunLog);
LogSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated'
});
