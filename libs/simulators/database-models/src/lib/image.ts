import {
  IImage,
  IEdamOntologyIdVersion,
  OperatingSystemType,
} from '@biosimulations/datamodel/common';
import { EdamOntologyIdVersionSchema } from './ontologyId';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import isUrl from 'is-url';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class Image implements IImage {
  @Prop({
    type: String,
    required: true,
    validate: [
      {
        validator: (value: any): boolean => {
          return typeof value === 'string' && isUrl('https://' + value);
        },
        message: (props: any): string =>
          `${props.value} is not a valid URL (including tag other than 'latest') for a Docker image (e.g., 'ghcr.io/biosimulators/tellurium:2.1.6')`,
      },
    ],
    default: undefined,
  })
  url!: string;

  @Prop({
    type: String,
    required: true,
    validate: [
      {
        validator: (value: any): boolean => {
          return (
            typeof value === 'string' &&
            value.match(/^sha256:[a-z0-9]{64,64}$/) !== null
          );
        },
        message: (props: any): string =>
          `${props.value} is not a valid Docker repository digest`,
      },
    ],
    default: undefined,
  })
  digest!: string;

  @Prop({
    type: EdamOntologyIdVersionSchema,
    required: true,
    validate: [
      {
        validator: (value: any): boolean => {
          return value?.id === 'format_3973';
        },
        message: (): string =>
          `Format must be the Docker image format (EDAM:format_3973)`,
      },
    ],
    default: undefined,
  })
  format!: IEdamOntologyIdVersion;

  @Prop({
    type: String,
    required: false,
    enum: (
      Object.entries(OperatingSystemType).map(
        (keyVal: [string, string]): string => {
          return keyVal[1];
        },
      ) as (string | null)[]
    ).concat([null]),
    default: undefined,
  })
  operatingSystemType!: OperatingSystemType | null;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
