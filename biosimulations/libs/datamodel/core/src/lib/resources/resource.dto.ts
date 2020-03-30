import { JournalReferenceDTO } from '../common/journalreference.dto';
import { AccessLevel } from '../enums/access-level';
import { License } from '../enums/licence';
import { ResourceType } from '../enums/resource-type';
import { PersonDTO } from '../common/person.dto';
import { IdentifierDTO } from '../common/identifier.dto';

export class ResourceDTO {
  type: ResourceType;
  id: string;
  owner: string;
  image: string;
  name: string;
  summary: string;
  description: string;
  tags: string[];
  accessToken: string;
  identifiers: IdentifierDTO[];
  references: JournalReferenceDTO[];
  authors: PersonDTO[];
  access: AccessLevel;
  license: License;
  created: Date;
  updated: Date;
}
