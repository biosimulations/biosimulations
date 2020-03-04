import { PersonInterface } from './person.interface';
import { ChartType } from './chart-type';
import { Model } from './model';
import { Project } from './project';
import { Simulation } from './simulation';
import { Visualization } from './visualization';
import { ModelService } from '../Services/Resources/model.service';
import { ProjectService } from '../Services/Resources/project.service';
import { SimulationService } from '../Services/Resources/simulation.service';
import { UtilsService } from '../Services/utils.service';
import { ChartTypeService } from '../Services/Resources/chart-type.service';
import { VisualizationService } from '../Services/Resources/visualization.service';
import * as md5 from 'md5';
import { Observable, of } from 'rxjs';
import { Person } from './person';

export class UserSerializer {
  fromJson(json: any): User {
    Object.entries(json).forEach(([key, value]) => {
      if (value === '') {
        json[key] = null;
      }
    });
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
export class User extends Person {
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

  public modelService: ModelService;
  public simulationService: SimulationService;
  public visualizationService: VisualizationService;
  public projectService: ProjectService;
  public chartTypeService: ChartTypeService;

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

  getProjects(): Observable<Project[]> {
    return this.projectService.list();
  }

  getModels(): Observable<Model[]> {
    return this.modelService.list();
  }

  getSimulations(): Observable<Simulation[]> {
    return this.simulationService.list();
  }

  getChartTypes(): Observable<ChartType[]> {
    return this.chartTypeService.list();
  }

  getVisualizations(): Observable<Visualization[]> {
    return this.visualizationService.list();
  }
}
