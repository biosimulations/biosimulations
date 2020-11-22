import {
  IImage,
  IEdamOntologyId,
} from '@biosimulations/datamodel/common';
import { EdamOntologyIdSchema } from './ontologyId';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import is from '@sindresorhus/is';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class Image implements IImage {  
  @Prop({
    type: String,
    required: true,
    validate: [{
      validator: is.urlString,
      message: (props: any): string => `${props.value} is not a valid URL`,
    }],
  })
  url!: string;

  @Prop({
    type: EdamOntologyIdSchema,
    required: true,
    validate: [{
      validator: (value: any): boolean => {
        return value?.id === 'format_3973';
      },
      message: (props: any): string => `Format must be the Docker image format (EDAM:format_3973)`,
    }],
  })
  format!: IEdamOntologyId;
}

export const ImageSchema = SchemaFactory.createForClass(
  Image
);
