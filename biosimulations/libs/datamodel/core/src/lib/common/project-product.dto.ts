import { JournalReferenceDTO } from './journalreference.dto';
import { ProjectProductType } from '../enums/project-product-type';
import { BiosimulationsId } from '../aliases/identity';
import { DTO } from '@biosimulations/datamodel/utils';

export class ProjectProductCore {
  reference: JournalReferenceDTO;
  type: ProjectProductType;
  label: string;
  description: string;
  resources: BiosimulationsId[];
}
export type ProjectProductDTO = DTO<ProjectProductCore>;
