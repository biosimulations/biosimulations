import { PersonInterface } from './person.interface';
import { Project } from './project';
import { Model } from './model';
import { Simulation } from './simulation';
import { Visualization } from './visualization';
import { UtilsService } from '../Services/utils.service';
import * as md5 from 'md5';

export class User implements PersonInterface {
  userId: string;
  auth0Id?: string;
  id?: number;
  username?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  organization?: string;
  website?: string;
  email?: string;
  emailVerified = false;
  emailPublic = false;
  gravatarEmail?: string;
  gitHubId?: string;
  googleScholarId?: string;
  orcId?: string;
  description?: string;
  projects?: Project[] = [];
  models?: Model[] = [];
  simulations?: Simulation[] = [];
  visualizations?: Visualization[] = [];

  getRoute(): (string | number)[] {
    return ['/user', this.username];
  }

  getFullName(): string {
    return UtilsService.getPersonFullName(this);
  }

  getGravatarImgUrl(): string {
    if (this.gravatarEmail) {
      return (
        'https://www.gravatar.com/avatar/' +
        md5(this.gravatarEmail.trim().toLowerCase()) +
        '?size=320'
      );
    } else {
      return 'assets/defaultSilhouette.svg';
    }
  }
}
