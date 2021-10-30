import {
  IImage,
  IEdamOntologyIdVersion,
  OperatingSystemType,
} from '@biosimulations/datamodel/common';
import { EdamOntologyIdVersionSchema } from './ontologyId';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
  storeSubdocValidationError: false,
  strict: 'throw',
})
export class Image implements IImage {
  @Prop({
    type: String,
    required: true,
    default: undefined,
  })
  url!: string;

  @Prop({
    type: String,
    required: true,    
    default: undefined,
  })
  digest!: string;

  @Prop({
    type: EdamOntologyIdVersionSchema,
    required: true,  
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
