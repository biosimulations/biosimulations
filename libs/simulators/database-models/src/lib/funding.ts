import {
  Funding as IFunding,
  IFunderRegistryOntologyId,
} from '@biosimulations/datamodel/common';
import { FunderRegistryOntologyIdSchema } from './ontologyId';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import isUrl from 'is-url';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
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
    validate: [
      {
        validator: (value: any): boolean => value == null || isUrl(value),
        message: (props: any): string => `${props.value} is not a valid URL`,
      },
    ],
    default: null,
  })
  url!: string | null;
}

export const FundingSchema = SchemaFactory.createForClass(Funding);
