import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { ChartType } from './chart-type';
import { Format } from './format';
import { Identifier } from './identifier';
import { JournalReference } from './journal-reference';
import { ModelParameter } from './model-parameter';
import { OntologyTerm } from './ontology-term';
import { Person } from './person';
import { Project } from './project';
import { RemoteFile } from './remote-file';
import { Simulation } from './simulation';
import { Taxon } from './taxon';
import { TopLevelResource } from 'src/app/Shared/Models/top-level-resource';
import { User } from './user';
import { Visualization } from './visualization';
import { ProjectService } from '../Services/project.service';
import { SimulationService } from '../Services/simulation.service';
import { UtilsService } from '../Services/utils.service';
import { ChartTypeService } from '../Services/chart-type.service';
import { VisualizationService } from '../Services/visualization.service';
import { UserService } from '../Services/user.service';
import { Observable, of } from 'rxjs';

export class ModelSerializer {
  static fromJson(json: any): Model {
    const model = new Model();
    // Simple, one to one corresponding feilds
    model.id = json.id;
    model.accessToken = json.accessToken;
    model.image = new RemoteFile('Model Picture', 'png', json.image, null);
    model.file = new RemoteFile('Model XML', 'xml', json.file, null);
    model.name = json.name;
    model.description = json.description;
    model.tags = json.tags;
    model.created = new Date(Date.parse(json.created));
    model.updated = new Date(Date.parse(json.updated));
    model.license = json.license as License;
    model.identifiers = [];
    model.OWNER = json.owner;
    // Boolean
    if (json.private) {
      model.access = AccessLevel.public;
    } else {
      model.access = AccessLevel.private;
    }
    // Nested fields
    if (json.taxon) {
      model.taxon = new Taxon(json.taxon.id, json.taxon.name);
    }

    if (json.format) {
      model.format = new Format(
        json.format.name,
        json.format.version,
        json.format.edamID,
        json.format.url
      );
    }
    if (json.framework) {
      model.framework = new OntologyTerm(
        json.framework.ontonlogy,
        json.framework.id,
        json.framework.name,
        json.framework.description,
        json.framework.iri
      );
    }
    if (json.authors) {
      model.authors = [];
      for (const author of json.authors) {
        model.authors.push(
          new Person(author.firstName, author.middleName, author.lastName)
        );
      }
    }
    if (json.references) {
      model.refs = [];
      for (const refrence of json.references) {
        model.refs.push(
          new JournalReference(
            refrence.authors,
            refrence.title,
            refrence.journal,
            refrence.volume,
            refrence.number,
            refrence.pages,
            refrence.year,
            refrence.doi
          )
        );
      }
    }
    if (json.taxon) {
      model.taxon = new Taxon(json.taxon.id, json.taxon.name);
    }
    // model.summary=json.summary
    return model;
  }
  static toJson(model: Model): any {}
}
export class Model implements TopLevelResource {
  id?: string;
  name?: string;
  description?: string;
  taxon?: Taxon;
  tags?: string[] = [];
  created?: Date;
  updated?: Date;
  license?: License;
  parameters: ModelParameter[] = [];
  file?: File | RemoteFile;
  image?: File | RemoteFile;
  framework?: OntologyTerm; // SBO modeling framework
  format?: Format;
  identifiers?: Identifier[] = [];
  refs?: JournalReference[] = [];
  authors?: (User | Person)[] = [];
  owner?: User;
  OWNER?: string;
  access?: AccessLevel;
  accessToken?: string = UtilsService.genAccessToken();

  public userservice: UserService;
  getOwner(): Observable<User> {
    if (this.userservice) {
      if (this.owner) {
        return of(this.owner);
      } else {
        const user = this.userservice.get$(this.OWNER);
        user.subscribe(owner => (this.owner = owner));
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

  getBioModelsId(): string {
    for (const id of this.identifiers) {
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
      return [new Person(this.OWNER)];
    }
  }

  getProjects(): Project[] {
    return [
      ProjectService._get('001'),
      ProjectService._get('002'),
      ProjectService._get('003'),
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
