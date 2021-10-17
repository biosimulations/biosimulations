import { IPythonApi } from '@biosimulations/datamodel/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import isUrl from 'is-url';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class PythonApi implements IPythonApi {
  @Prop({
    type: String,
    required: true,
    default: undefined,
  })
  package!: string;

  @Prop({
    type: String,
    required: true,
    validate: [
      {
        validator: (value: any): boolean => {
          if (typeof value !== 'string') {
            return false;
          }

          return (
            value.match(
              /^[a-zA-Z_][a-zA-Z_0-9]*(\.[a-zA-Z_][a-zA-Z_0-9]*)*$/,
            ) !== null
          );
        },
        message: (props: any): string =>
          `${props.value} is not a valid URL for a Docker image (e.g., 'ghcr.io/biosimulators/tellurium:2.1.6')`,
      },
    ],
    default: undefined,
  })
  module!: string;

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

export const PythonApiSchema = SchemaFactory.createForClass(PythonApi);
