import { ChartType } from './chart-type';
import { Format } from './format';
import { Identifier } from './identifier';

import { ModelParameter } from './model-parameter';
import { OntologyTerm } from './ontology-term';
import { Person } from './person';
import { Project } from './project';
import { RemoteFile } from './remote-file';
import { Simulation } from './simulation';
import { Taxon } from './taxon';
import { TopLevelResource } from './top-level-resource';
import { User } from './user';
import { Visualization } from './visualization';
import { ProjectService } from '../Services/Resources/project.service';
import { SimulationService } from '../Services/Resources/simulation.service';
import { UtilsService } from '../Services/utils.service';
import { ChartTypeService } from '../Services/Resources/chart-type.service';
import { VisualizationService } from '../Services/Resources/visualization.service';
import { UserService } from '../Services/user.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BiomodelVariable } from '@biosimulations/datamodel/common';

export class Model extends TopLevelResource {
  taxon?: Taxon;
  parameters: ModelParameter[] = [];
  file?: RemoteFile;
  variables: BiomodelVariable[] = [];
  framework?: OntologyTerm; // SBO modeling framework
  format?: Format;
  constructor() {
    super();
  }
  public simulationService: SimulationService;
  public visualizationService: VisualizationService;
  public projectService: ProjectService;
  public chartTypeService: ChartTypeService;
  public userservice: UserService;
  getOwner(): Observable<User> {
    if (this.userservice) {
      if (this.owner) {
        return of(this.owner);
      } else {
        const user = this.userservice.get$(this.ownerId);
        user.pipe(tap((owner) => (this.owner = owner)));
        return user;
      }
    } else {
      throw new Error('No user service');
    }
  }
  getIcon() {
    return { type: 'fas', icon: 'project-diagram' };
  }

  getRoute(): (string | number)[] {
    return ['/models', this.id];
  }

  getBioModelsId(): string | null {
    for (const id of this.identifiers || []) {
      if (id.namespace === 'biomodels.db') {
        return id.id;
      }
    }
    return null;
  }

  getAuthors(): (User | Person)[] {
    if (this.authors && this.authors.length) {
      const people: Person[] = [];
      this.authors.forEach((person: Person) => {
        people.push(person);
      });
      return people;
    } else {
      return [
        new Person({
          firstName: this.ownerId || '',
          middleName: null,
          lastName: '',
        }),
      ];
    }
  }

  getProjects(): Observable<Project[]> {
    return this.projectService.list();
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
