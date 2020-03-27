import { JournalReferenceDTO } from '../common/journalreference.dto';
import { AccessLevel } from '../enums/access-level';
import { License } from '../enums/licence';

export class ResourceDTO {
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
