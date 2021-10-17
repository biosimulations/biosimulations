import { ICli, PackageRepository } from '@biosimulations/datamodel/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import isUrl from 'is-url';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class Cli implements ICli {
  @Prop({
    type: String,
    enum: Object.keys(PackageRepository).map(
      (k) => PackageRepository[k as PackageRepository],
    ),
    required: true,
    default: undefined,
  })
  packageRepository!: PackageRepository;

  @Prop({
    type: String,
    required: true,
    default: undefined,
  })
  package!: string;

  @Prop({
    type: String,
    required: true,
    default: undefined,
  })
  command!: string;

  @Prop({
    type: String,
    required: false,
    validate: [
      {
        validator: (value: any): boolean => {
          return value === null || isUrl(value);
        },
        message: (props: any): string => `${props.value} is not a valid URL`,
      },
    ],
    default: undefined,
  })
  installationInstructions!: string | null;
}

export const CliSchema = SchemaFactory.createForClass(Cli);
