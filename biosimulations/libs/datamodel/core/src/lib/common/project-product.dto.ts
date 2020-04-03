import { JournalReferenceDTO } from './journalreference.dto';
import { ProjectProductType } from '../enums/project-product-type';

export class ProjectProductDTO {
  reference: JournalReferenceDTO;
  type: ProjectProductType;
  label: string;
  description: string;
  resources: string[];
}
