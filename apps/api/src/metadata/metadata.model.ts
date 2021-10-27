import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Schema as SchemaType } from 'mongoose';
import {
  ArchiveMetadata,
  DescribedIdentifier,
  LabeledIdentifier,
} from '@biosimulations/datamodel/common';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { ObjectIdValidator } from '@biosimulations/datamodel-database';
@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
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
  public attribute_uri!: string | null;

  @Prop({ type: String, required: false, index: true })
  public attribute_label!: string | null;
}
const DescribedIdentifierSchema = SchemaFactory.createForClass(
  DescribedIdentifierModel,
);

@Schema({
  _id: false,
  strict: 'throw',
  storeSubdocValidationError: false,
  minimize: false,
})
export class MetadataModel implements ArchiveMetadata {
  @Prop({ type: String })
  public uri!: string;

  @Prop({ type: String, required: false, default: undefined })
  public title?: string;

  @Prop({ type: String, required: false, default: undefined })
  public abstract?: string;

  @Prop({ type: [LabeledIdentifierSchema] })
  public keywords: LabeledIdentifierModel[] = [];

  @Prop({ type: [String], required: true })
  public thumbnails: string[] = [];

  @Prop({ type: String, required: false, default: undefined })
  public description?: string;

  @Prop({ type: [LabeledIdentifierSchema] })
  public taxa: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  public encodes: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  public sources: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  public predecessors: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  public successors: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  public seeAlso: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  public identifiers: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  public citations: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  public creators: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  public contributors: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  public license?: LabeledIdentifierModel[] = [];

  @Prop({ type: [LabeledIdentifierSchema] })
  public funders: LabeledIdentifierModel[] = [];

  @Prop({ type: [DescribedIdentifierSchema] })
  public other: DescribedIdentifier[] = [];

  @Prop({ type: [String], required: true })
  public modified: string[] = [];

  @Prop({ type: String, required: false, default: undefined })
  public created = '';
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

  @Prop({ type: Boolean, required: false, default: false })
  public isPublic!: boolean;

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

export type SimulationRunMetadataIdModel = SimulationRunMetadataModel & { _id: any };
