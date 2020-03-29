export class UserDTO implements PersonDTO {
  id: string;
  userName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  organization: string;
  website: string;
  email: string;
  emailVerified: boolean;
  emailPublic: boolean;
  gravatarEmail: string;
  gitHubId: string;
  orcId: string;
  description: string;
  summary: string;
}
