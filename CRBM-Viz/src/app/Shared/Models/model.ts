import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { Format } from './format';
import { Identifier } from './identifier';
import { JournalReference } from './journal-reference';
import { OntologyTerm } from './ontology-term';
import { Person } from './person';
import { Simulation } from './simulation';
import { Taxon } from './taxon';
import { User } from './user';
import { Visualization } from './visualization';
import { UtilsService } from '../Services/utils.service';

export class Model {
  id?: string;
  name?: string;
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
  simulations?: Simulation[] = [];
  visualizations?: Visualization[] = [];

  getIcon() {
    return {type: 'fas', icon: 'project-diagram'};
  }

  getRoute(): (string | number)[] {
    return ['/models', this.id];
  }

  getFileUrl(): string {
    return '/assets/examples/model.xml';
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
}
