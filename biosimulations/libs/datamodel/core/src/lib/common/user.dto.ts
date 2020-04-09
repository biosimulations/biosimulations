import { PersonDTO } from './person.dto';
export enum ExternalSite {
  orcId = 'ORCiD',
  gitHub = 'Github',
  googleScholar = 'Google Scholar',
}
export interface ExternalProfile {
  site: ExternalSite;
  userId: string;
}
export interface ProfileDTO {
  userName: string;
  organization: string;
  website: string;
  gravatarEmail: string;
  description: string;
  summary: string;
  externalProfiles: ExternalProfile[];
}
export interface EmailInfoDTO {
  primaryEmail: string;
  emailVerified: boolean;
  emailPublic: boolean;
  emails: string[];
}

export interface UserDTO extends PersonDTO {
  userID: string;
  profile: ProfileDTO;
  emails: EmailInfoDTO;
}
