import { PersonInterface } from './person.interface';
import { ChartType } from './chart-type';
import { Model } from './model';
import { Project } from './project';
import { Simulation } from './simulation';
import { Visualization } from './visualization';
import { ModelService } from '../Services/model.service';
import { ProjectService } from '../Services/project.service';
import { SimulationService } from '../Services/simulation.service';
import { UtilsService } from '../Services/utils.service';
import { ChartTypeService } from '../Services/chart-type.service';
import { VisualizationService } from '../Services/visualization.service';
import * as md5 from 'md5';

export class UserSerializer {
  fromJson(json: any): User {
    const user = new User();
    user.userId = json._id;
    user.userName = json.userName;
    user.firstName = json.firstName;
    user.middleName = json.middleName;
    user.lastName = json.lastName;
    user.organization = json.organization;
    user.website = json.website;
    user.email = json.email;
    user.emailVerified = json.emailVerified || false;
    user.emailPublic = json.emailPublic || false;
    user.gravatarEmail = json.gravatarEmail;
    user.gitHubId = json.gitHubId;
    user.googleScholarId = json.googleScholarId;
    user.orcId = json.orcId;
    user.description = json.description;

    return user;
  }
  toJson(user: User): any {
    return {
      _id: user.userId,
      userName: user.userName,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      organization: user.organization,
      website: user.website,
      email: user.email,
      emailVerified: user.emailVerified || false,
      emailPublic: user.emailPublic || false,
      gravatarEmail: user.gravatarEmail,
      gitHubId: user.gitHubId,
      googleScholarId: user.googleScholarId,
      orcId: user.orcId,
      description: user.description,
    };
  }
}
export class User implements PersonInterface {
  userId?: string | number;
  userName?: string;
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

  getRoute(): (string | number)[] {
    return ['/user', this.userName];
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

  getProjects(): Project[] {
    return [
      ProjectService._get('001'),
      ProjectService._get('002'),
      ProjectService._get('003'),
    ];
  }

  getModels(): Model[] {
    return [
      ModelService._get('001'),
      ModelService._get('002'),
      ModelService._get('003'),
    ];
  }

  getSimulations(): Simulation[] {
    return [
      SimulationService._get('001'),
      SimulationService._get('002'),
      SimulationService._get('003'),
    ];
  }

  getChartTypes(): ChartType[] {
    return [
      ChartTypeService._get('001'),
      ChartTypeService._get('002'),
      ChartTypeService._get('003'),
    ];
  }

  getVisualizations(): Visualization[] {
    return [
      VisualizationService._get('001'),
      VisualizationService._get('002'),
      VisualizationService._get('003'),
    ];
  }
}
