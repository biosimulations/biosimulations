import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaType } from 'mongoose';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';

@Schema({
  strict: 'throw',
  useNestedStrict: true,
  collection: 'Projects',
})
export class ProjectModel extends Document {
  @Prop({
    required: true,
    type: String,
    unique: true,
    index: true,
    immutable: true,
  })
  public id!: string;

  @Prop({
    ref: SimulationRunModel.name,
    required: true,
    type: String,
    unique: true,
    index: true,
    immutable: false,
  })
  public simulationRun!: string;

  public created!: string;
  public updated!: string;
}

export const ProjectModelSchema: SchemaType<ProjectModel> =
  SchemaFactory.createForClass(ProjectModel);
ProjectModelSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated',
});
