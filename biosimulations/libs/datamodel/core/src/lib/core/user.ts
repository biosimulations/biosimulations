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
  organization: string | null;
  website: string | null;
  // Todo change this to hashed url string to prevent sharing email
  gravatarEmail: string | null;
  description: string | null;
  summary: string | null;
  externalProfiles: ExternalProfile[] | null;
  // Will depend on if emails are set to private
  emails: Email | null;
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
