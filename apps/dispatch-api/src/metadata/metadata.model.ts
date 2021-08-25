/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Schema as SchemaType } from 'mongoose';
import {
  ArchiveMetadata,
  DescribedIdentifier,
  LabeledIdentifier,
  ObjectIdValidator,
} from '@biosimulations/datamodel/common';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class LabeledIdentifierModel implements LabeledIdentifier {
  @Prop({ type: String, required: false, index: true })
  public label!: string;
  @Prop({ type: String, required: false, index: true })
  public uri!: string | null;
}
const LabeledIdentifierSchema = SchemaFactory.createForClass(
  LabeledIdentifierModel,
);

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class DescribedIdentifierModel
  extends LabeledIdentifierModel
  implements DescribedIdentifier
{
  @Prop({ type: String, required: true, index: true })
  public label!: string;
  @Prop({ type: String, required: false, index: true })
  public uri!: string | null;
  @Prop({ type: String, required: false, index: true })
  attribute_uri?: string;
  @Prop({ type: String, required: false, index: true })
  attribute_label?: string;
}
const DescribedIdentifierSchema = SchemaFactory.createForClass(
  DescribedIdentifierModel,
);

@Schema({
  _id: false,
  strict: 'throw',
  useNestedStrict: true,
  storeSubdocValidationError: false,
  minimize: false,
})
export class MetadataModel implements ArchiveMetadata {
  @Prop({ type: String })
  uri!: string;

  @Prop({ type: String, required: false, default: undefined })
  title?: string;

  @Prop({ type: String, required: false, default: undefined })
  abstract?: string;

  @Prop({ type: [LabeledIdentifierSchema] })
  keywords: LabeledIdentifierModel[] = [];

  @Prop({ type: [String], required: true })
  thumbnails: string[] = [];

  @Prop({ type: String, required: false, default: undefined })
  description?: string;

  @Prop({ type: [LabeledIdentifierSchema] })
  taxa: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  encodes: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  sources: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  predecessors: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  successors: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  seeAlso: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  identifiers: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  citations: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  creators: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  contributors: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  license?: LabeledIdentifierModel;

  @Prop({ type: [LabeledIdentifierSchema] })
  funders: LabeledIdentifierModel[] = [];

  @Prop({ type: [DescribedIdentifierSchema] })
  other: DescribedIdentifier[] = [];

  @Prop({ type: [String], required: true })
  modified: string[] =[];

  @Prop({ type: String, required: false, default: undefined })
  created: string ='';
}

export const MetadataModelSchema = SchemaFactory.createForClass(MetadataModel);
MetadataModelSchema.set('strict', 'throw');

@Schema({ collection: 'Metadata' })
export class SimulationRunMetadataModel extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: SimulationRunModel.name,
    required: true,
    unique: true,
    index: true,
    validate: ObjectIdValidator,
    immutable: true,
  })
  public simulationRun!: string;
  @Prop({ type: [MetadataModelSchema], minimize: false, required: false })
  public metadata!: [MetadataModel];

  public created!: string;
  public updated!: string;
}

export const SimulationRunMetadataSchema: SchemaType<SimulationRunMetadataModel> =
  SchemaFactory.createForClass(SimulationRunMetadataModel);
SimulationRunMetadataSchema.set('strict', 'throw');
SimulationRunMetadataSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated',
});
