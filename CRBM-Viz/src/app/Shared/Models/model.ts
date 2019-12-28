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
import { matFormFieldAnimations } from '@angular/material';

export class ModelSerializer {
  fromJson(json: any): Model {
    const model = new Model();
    // Simple, one to one corresponding feilds
    model.id = json.id;
    model.name = json.name;
    model.description = json.description;
    model.tags = json.tags;
    model.created = new Date(json.created);
    model.updated = new Date(json.updated);
    model.license = License[json.licence as string];
    if (json.taxon) {
      model.taxon = new Taxon(json.taxon.id, json.taxon.name);
    }

    // Nested fields
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
        json.framework.string,
        json.framework.description,
        json.framework.iri
      );
    }
    // model.summary=json.summary
    return model;
  }
  toJson(model: Model): any {}
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
  access?: AccessLevel;
  accessToken?: string = UtilsService.genAccessToken();

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
      return this.authors;
    } else {
      return [this.owner];
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
