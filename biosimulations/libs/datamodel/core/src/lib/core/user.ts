import { PersonDTO } from '../common';
import { Email } from '../common/alias';

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
  // Todo change this to hashed url string to prevent sharing email
  gravatarEmail: string;
  description: string;
  summary: string;
  externalProfiles: ExternalProfile[];
  // Will depend on if emails are set to private
  emails: Email;
}
export interface EmailInfoDTO {
  primaryEmail: string;
  gravatarEmail: string;
  emailVerified: boolean;
  emailPublic: boolean;
  emails: string[];
}

export interface UserDTO extends PersonDTO {
  firstName: string;
  middleName: string;
  lastName: string;
  userID: string;
  profile: ProfileDTO;
  emails: EmailInfoDTO;
}
