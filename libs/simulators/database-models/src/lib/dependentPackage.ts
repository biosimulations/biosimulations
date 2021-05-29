import { DependentPackage as IDependentPackage } from '@biosimulations/datamodel/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class DependentPackage implements IDependentPackage {
  @Prop({
    type: String,
    required: true,
    default: undefined,
  })
  name!: string;

  @Prop({
    type: String,
    required: false,
    default: undefined,
  })
  version!: string | null;

  @Prop({
    type: Boolean,
    required: true,
    default: undefined,
  })
  required!: boolean;

  @Prop({
    type: Boolean,
    required: true,
    default: undefined,
  })
  freeNonCommercialLicense!: boolean;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  url!: string | null;
}

export const DependentPackageSchema = SchemaFactory.createForClass(
  DependentPackage,
);
