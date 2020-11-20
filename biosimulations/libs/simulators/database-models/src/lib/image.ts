import {
  IImage,
  IEdamOntologyId,
} from '@biosimulations/datamodel/common';
import { EdamOntologyIdSchema } from './ontologyId';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
  useNestedStrict: true,
})
export class Image implements IImage {  
  @Prop({ type: String, required: true })
  url!: string;

  @Prop({ type: EdamOntologyIdSchema, required: true })
  format!: IEdamOntologyId;
}

export const ImageSchema = SchemaFactory.createForClass(
  Image
);
