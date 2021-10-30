import { IPythonApi } from '@biosimulations/datamodel/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
    default: undefined,
  })
  module!: string;

  @Prop({
    type: String,
    required: false,
    default: undefined,
  })
  installationInstructions!: string | null;
}

export const PythonApiSchema = SchemaFactory.createForClass(PythonApi);
