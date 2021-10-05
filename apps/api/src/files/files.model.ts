import { ObjectIdValidator } from '@biosimulations/datamodel/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as SchemaType, Types } from 'mongoose';
import { SimulationRunModel } from '../simulation-run/simulation-run.model';
import { File } from '@biosimulations/datamodel/common';
@Schema({
  storeSubdocValidationError: false,
  collection: 'Files',
  strict: 'throw',
  useNestedStrict: true,
})
export class FileModel extends Document implements File {
  public created!: string;
  public updated!: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
    immutable: true,
  })
  public id: string;

  @Prop({})
  public name: string;

  @Prop({
    type: Types.ObjectId,
    ref: SimulationRunModel.name,
    required: true,
    index: true,
    validate: ObjectIdValidator,
    immutable: true,
  })
  public simulationRun: string;

  @Prop({})
  public size: number;

  @Prop({})
  public format: string;

  @Prop({})
  public master: boolean;

  @Prop({})
  public url: string;

  @Prop({})
  public location!: string;
  public constructor(
    id: string,
    name: string,
    format: string,
    master: boolean,
    size: number,
    simulationRun: string,
    url: string,
  ) {
    super();
    this.id = id;
    this.url = url;
    this.name = name;
    this.format = format;
    this.master = master;
    this.simulationRun = simulationRun;
    this.size = size;
  }
}

export const FileModelSchema: SchemaType<FileModel> =
  SchemaFactory.createForClass(FileModel);
FileModelSchema.set('strict', 'throw');
FileModelSchema.set('timestamps', {
  createdAt: 'created',
  updatedAt: 'updated',
});
