import { DTO } from '@biosimulations/datamodel/utils';

export interface PersonCore {
  firstName: string;
  middleName: string;
  lastName: string;
}

export type PersonDTO = DTO<PersonCore>;
