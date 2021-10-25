import { ObjectIdValidator } from '@biosimulations/datamodel-database';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { Document } from 'mongoose';

// TODO set strict to throw once a datamodel is finalized
@Schema({
  storeSubdocValidationError: false,
  collection: 'Specifications',
  strict: false,
  id: false,
})
export class SpecificationsModel extends Document {
  @Prop({
    required: true,
    index: true,
    immutable: true,
    type: String,
  })
  public id!: string;

  @Prop({
    type: String,
  })
  public name!: string;

  @Prop({
    required: true,
    type: String,
    immutable: true,
    ref: SimulationRunModel.name,
    validate: ObjectIdValidator,
    index: true,
  })
  public simulationRun!: string;

  @Prop({
    type: Array,
  })
  public outputs!: any[];

  @Prop({
    type: [Object],
  })
  public tasks!: any[];

  @Prop({
    Type: [Object],
  })
  public dataGenerators!: any[];

  @Prop({
    type: [Object],
  })
  public models!: any[];

  @Prop({
    type: Object,
  })
  public simulations!: any[];

  public created!: string;
  public updated!: string;
}

export const SpecificationsModelSchema =
  SchemaFactory.createForClass(SpecificationsModel);

SpecificationsModelSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated',
});
