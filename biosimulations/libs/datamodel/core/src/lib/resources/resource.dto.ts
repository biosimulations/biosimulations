import { JournalReferenceDTO } from '../common/journal-reference.dto';
import { AccessLevel } from '../enums/access-level';
import { License } from '../enums/licence';
import { ResourceType } from '../enums/resource-type';
import { PersonDTO } from '../common/person.dto';
import { IdentifierDTO } from '../common/identifier.dto';

export class ResourceDTO {
  type: ResourceType;
  id: string;
  owner: string;  
  name: string;
  image: string;  
  description: string;
  tags: string[];  
  identifiers: IdentifierDTO[];
  references: JournalReferenceDTO[];
  authors: PersonDTO[];
  access: AccessLevel;
  accessToken: string;
  license: License;
  created: Date;
  updated: Date;
}
