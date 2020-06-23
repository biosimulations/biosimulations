import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  DataWithUserIdentifier,
  DataWithFileIdentifier,
  DataWithModelIdentifier,
} from './identifiers.dto';

export class BiomodelRelationship {
  @ApiProperty()
  owner!: DataWithUserIdentifier;
  @ApiProperty()
  file!: DataWithFileIdentifier;
  @ApiProperty()
  image!: DataWithFileIdentifier;
  @ApiProperty()
  parent!: DataWithModelIdentifier;
}

export class CreateBiomodelRelationship extends OmitType(
  BiomodelRelationship,
  [],
) {}
