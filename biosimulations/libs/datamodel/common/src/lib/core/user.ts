import { Person, Identifier } from '../common';
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
export interface Profile {
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  userName: string;
  organization: string | null;
  website: string | null;
  // Todo change this to hashed url string to prevent sharing email
  image: string | null;
  description: string | null;
  summary: string | null;
  externalProfiles: ExternalProfile[] | null;
  // Will depend on if emails are set to private
  emails: Email[] | null;
}
export interface EmailInfo {
  email: Email;
  public: boolean;
  verified: boolean;
  gravatar: boolean;
  primary: boolean;
}

export interface User extends Person {
  firstName: string | null;
  middleName: string | null;
  lastName: string;
  identifiers: Identifier[];
  userID: string;
  profile: Profile;
  emails: EmailInfo[];
}
