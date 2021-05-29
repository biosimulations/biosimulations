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
import { Profile } from '@biosimulations/datamodel/common';
import { JsonPipe } from '@angular/common';
import { isNull } from 'util';

export class UserSerializer {
  fromJson(json: Profile): User {
    const user = new User(json);
    return user;
  }
  toJson(user: User): any {
    return {
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
  userName: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  organization: string | null;
  website: string | null;
  email: string | null;
  image: string | null;
  emailVerified = false;
  emailPublic = false;
  gravatarEmail?: string;
  gitHubId?: string;
  googleScholarId?: string;
  orcId?: string;
  description: string | null;

  constructor(json: Profile) {
    // TODO make this definite
    super({
      firstName: json.firstName || '',
      middleName: json.middleName,
      lastName: json.lastName || '',
    });
    this.firstName = json.firstName || '';
    this.lastName = json.lastName || '';
    this.userName = json.userName;
    this.middleName = json.middleName;
    this.organization = json.organization;
    this.website = json.website;
    this.email = json.emails ? json.emails[0] : null;
    this.image = json.image;
    this.description = json.description;
  }
  public modelService?: ModelService;
  public simulationService?: SimulationService;
  public visualizationService?: VisualizationService;
  public projectService?: ProjectService;
  public chartTypeService?: ChartTypeService;

  getRoute(): string[] {
    return ['/user', this.userName];
  }

  getFullName(): string {
    return UtilsService.getPersonFullName(this);
  }

  getGravatarImgUrl(): string {
    if (this.image) {
      return this.image;
    }
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

  getProjects(): Observable<Project[] | null> {
    return this.projectService ? this.projectService.list() : of(null);
  }

  getModels(): Observable<Model[] | null> {
    return this.modelService ? this.modelService.list() : of(null);
  }

  getSimulations(): Observable<Simulation[] | null> {
    return this.simulationService ? this.simulationService.list() : of(null);
  }

  getChartTypes(): Observable<ChartType[] | null> {
    return this.chartTypeService ? this.chartTypeService.list() : of(null);
  }

  getVisualizations(): Observable<Visualization[] | null> {
    return this.visualizationService
      ? this.visualizationService.list()
      : of(null);
  }
}
