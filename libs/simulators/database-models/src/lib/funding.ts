import {
  Funding as IFunding,
  IFunderRegistryOntologyId,
} from '@biosimulations/datamodel/common';
import { FunderRegistryOntologyIdSchema } from './ontologyId';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
class Funding implements IFunding {
  @Prop({
    type: FunderRegistryOntologyIdSchema,
    required: true,
    default: undefined,
  })
  funder!: IFunderRegistryOntologyId;

  @Prop({ type: String, required: false, default: null })
  grant!: string | null;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  url!: string | null;
}

export const FundingSchema = SchemaFactory.createForClass(Funding);
