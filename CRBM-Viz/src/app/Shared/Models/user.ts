import { Model } from './model';
import { Simulation } from './simulation';
import { Visualization } from './visualization';
import * as md5 from 'md5';

export class User {
  auth0Id: string;
  id: number;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  organization: string;
  website: string;
  email: string;
  emailVerified = false;
  emailPublic = false;
  gravatarEmail: string;
  gitHubId: string;
  googleScholarId: string;
  orcId: string;  
  description: string;
  models: Model[];
  simulations: Simulation[];
  visualizations: Visualization[];

  constructor(auth0Id?: string, id?: number, username?: string,
    firstName?: string, middleName?: string, lastName?: string,
    organization?: string, website?: string,
    email?: string, emailVerified?: boolean, emailPublic?: boolean,
    gravatarEmail?: string, gitHubId?: string, googleScholarId?: string, orcId?: string,
    description?: string,
    models?: Model[], simulations?: Simulation[], visualizations?: Visualization[]
    ) {
    this.auth0Id = auth0Id;
    this.id = id;
    this.username = username;
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;    
    this.organization = organization;
    this.website = website;
    this.email = email;
    this.emailVerified = emailVerified;
    this.emailPublic = emailPublic;
    this.gravatarEmail = gravatarEmail;
    this.gitHubId = gitHubId;
    this.googleScholarId = googleScholarId;
    this.orcId = orcId;    
    this.description = description;

    if (models) {
      this.models = models;
    } else {
      this.models = [];
    }

    if (simulations) {
      this.simulations = simulations;
    } else {
      this.simulations = [];
    }

    if (visualizations) {
      this.visualizations = visualizations;
    } else {
      this.visualizations = [];
    }
  }

  getRoute() {
    return ['/profile', this.id];
  }

  getFullName(): string {
    const name: string[] = [];
    if (this.firstName) {
        name.push(this.firstName);
    }
    if (this.middleName) {
        name.push(this.middleName);
    }
    if (this.lastName) {
        name.push(this.lastName);
    }
    return name.join(' ');
  }

  getGravatarImgUrl(): string {
    if (this.gravatarEmail) {
      return 'https://www.gravatar.com/avatar/' + md5(this.gravatarEmail.trim().toLowerCase()) + '?size=320';
    } else {
      return 'assets/defaultSilhouette.svg';
    }
  }
}
