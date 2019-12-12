import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
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
import { User } from './user';
import { Visualization } from './visualization';
import { VisualizationSchema } from './visualization-schema';
import { ProjectService } from '../Services/project.service';
import { SimulationService } from '../Services/simulation.service';
import { UtilsService } from '../Services/utils.service';
import { VisualizationService } from '../Services/visualization.service';
import { VisualizationSchemaService } from '../Services/visualization-schema.service';

export class Model {
  id?: string;
  name?: string;
  file?: File | RemoteFile;
  parameters: ModelParameter[] = [];
  image?: File | RemoteFile;
  description?: string;
  taxon?: Taxon;
  tags?: string[] = [];
  framework?: OntologyTerm; // SBO modeling framework
  format?: Format;
  identifiers?: Identifier[] = [];
  refs?: JournalReference[] = [];
  authors?: (User | Person)[] = [];
  owner?: User;
  access?: AccessLevel;
  accessToken?: string = UtilsService.genAccessToken();
  license?: License;
  created?: Date;
  updated?: Date;

  getIcon() {
    return {type: 'fas', icon: 'project-diagram'};
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

  getVisualizations(): Visualization[] {
    return [
      VisualizationService._get(1),
      VisualizationService._get(2),
      VisualizationService._get(3),
    ];
  }

  getVisualizationSchemas(): VisualizationSchema[] {
    return [
      VisualizationSchemaService._get('001'),
      VisualizationSchemaService._get('002'),
      VisualizationSchemaService._get('003'),
    ];
  }
}
