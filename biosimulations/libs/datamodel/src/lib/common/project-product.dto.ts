import { JournalReferenceDTO } from './journalreference.dto';

export class ProjectProductDTO {
  reference: JournalReferenceDTO;
  type: string;
  label: string;
  description: string;
  resources: string[];
}
