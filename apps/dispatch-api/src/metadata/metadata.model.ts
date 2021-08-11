/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Schema as SchemaType } from 'mongoose';
import {
  ArchiveMetadata,
  DescribedIdentifier,
  LabeledIdentifier,
} from '@biosimulations/datamodel/common';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class LabeledIdentifierModel implements LabeledIdentifier {
  @Prop({ type: String, required: true, index: true })
  public label!: string;
  @Prop({ type: String, required: true, index: true })
  public uri!: string;
}
const LabeledIdentifierSchema = SchemaFactory.createForClass(
  LabeledIdentifierModel,
);

export class MetadataModel implements ArchiveMetadata {
  @Prop({ type: String, required: true })
  uri!: string;

  @Prop({ type: String, required: true })
  title?: string;

  @Prop({ type: String, required: true })
  abstract?: string;

  @Prop({ type: LabeledIdentifierSchema })
  keywords: LabeledIdentifierModel[] = [];

  @Prop({ type: String, required: true })
  thumbnails: string[] = [];

  @Prop({ type: String, required: true })
  description?: string;

  @Prop({ type: LabeledIdentifierSchema })
  taxa: LabeledIdentifierModel[] = [];

  @Prop({ type: LabeledIdentifierSchema })
  encodes: LabeledIdentifierModel[] = [];

  @Prop({ type: LabeledIdentifierSchema })
  sources: LabeledIdentifierModel[] = [];

  @Prop({ type: LabeledIdentifierSchema })
  predecessors: LabeledIdentifierModel[] = [];

  @Prop({ type: LabeledIdentifierSchema })
  successors: LabeledIdentifierModel[] = [];

  @Prop({ type: LabeledIdentifierSchema })
  seeAlso: LabeledIdentifierModel[] = [];

  @Prop({ type: LabeledIdentifierSchema })
  identifiers: LabeledIdentifierModel[] = [];

  @Prop({ type: LabeledIdentifierSchema })
  citations: LabeledIdentifierModel[] = [];

  @Prop({ type: LabeledIdentifierSchema })
  creators: LabeledIdentifierModel[] = [];

  @Prop({ type: LabeledIdentifierSchema })
  contributors: LabeledIdentifierModel[] = [];

  @Prop({ type: LabeledIdentifierSchema })
  license?: LabeledIdentifierModel;

  @Prop({ type: LabeledIdentifierSchema })
  funders: LabeledIdentifierModel[] = [];

  @Prop({})
  other: DescribedIdentifier[] = [];

  @Prop({})
  modified!: Date[];
}
@Schema({ collection: 'Projects' })
export class ProjectModel extends Document {
  // TODO see if we can add a ref to the simulation run here
  @Prop({ type: Types.ObjectId, required: true, unique: true, index: true })
  public simulationRun!: string;
  @Prop()
  public name!: string;
  @Prop()
  public created!: Date;
  @Prop()
  public updated!: Date[];

  @Prop({
    type: [MetadataModel],
    required: false,
  })
  public metadata!: MetadataModel[];
}

export const ProjectSchema: SchemaType<ProjectModel> =
  SchemaFactory.createForClass(ProjectModel);
ProjectSchema.set('strict', 'throw');
ProjectSchema.set('timestamps', {
  createdAt: 'submitted',
});
