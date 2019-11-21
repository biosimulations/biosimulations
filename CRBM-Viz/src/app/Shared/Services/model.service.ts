import { Injectable, Injector } from '@angular/core';
import { AccessLevel } from '../Enums/access-level';
import { Format } from '../Models/format';
import { Identifier } from '../Models/identifier';
import { JournalReference } from '../Models/journal-reference'
import { License } from '../Models/license';
import { Model } from '../Models/model';
import { OntologyTerm } from '../Models/ontology-term';
import { Taxon } from '../Models/taxon';
import { User } from '../Models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private userService: UserService;
  private simulationService: SimulationService;
  private visualizationsService: VisualizationsService;

  constructor(private injector: Injector) {}

  static _get(id: string): Model {
    let model: Model;

    switch (id) {
      default:
      case '001':
        model = new Model(
          id,
          'EPSP ACh event',
          'Model of a nicotinic Excitatory Post-Synaptic Potential in a Torpedo electric organ. Acetylcholine is not represented explicitely, but by an event that changes the constants of transition from unliganded to liganded.',
          new Taxon(7787, 'Tetronarce californica'),
          ['neurotransmission', 'signaling'],
          new Format('SBML', 'L2V4', 2585, 'http://sbml.org'),
          [
            new Identifier('biomodels.db', 'BioModels', 'BIOMD0000000001'),
          ],
          [
            new JournalReference(['Karr, JR', 'Shaikh, B'], 'Journal', 101, 3, '10-20', 2019),
            new JournalReference(['Skaf, Y', 'Wilson, M'], 'Journal', 101, 3, '10-20', 2019),
          ],
          UserService._get(4),
          new Date(Date.parse('1996-11-01 00:00:00')),
        );
        break;

      case '003':
        model = new Model(
          '003',
          'Min Mit Oscil',
          'Minimal cascade model for the mitotic oscillator involving cyclin and cdc2 kinase.',
          new Taxon(8292, 'Xenopus laevis'),
          ['cell cycle', 'mitosis'],
          new Format('SBML', 'L2V4', 2585, 'http://sbml.org'),
          [
            new Identifier('biomodels.db', 'BioModels', 'BIOMD0000000003'),
          ],
          [
            new JournalReference(['Karr, JR', 'Shaikh, B'], 'Journal', 101, 3, '10-20', 2019),
            new JournalReference(['Skaf, Y', 'Wilson, M'], 'Journal', 101, 3, '10-20', 2019),
          ],
          UserService._get(5),
          new Date(Date.parse('1991-10-15 00:00:00')),
        );
        break;

      case '006':
        model = new Model(
          '006',
          'Cell Cycle 6 var',
          'Mathematical model of the interactions of cdc2 and cyclin.',
          new Taxon(33154, 'Homo sapiens'),
          ['cell cycle'],
          new Format('SBML', 'L2V4', 2585, 'http://sbml.org'),
          [
            new Identifier('biomodels.db', 'BioModels', 'BIOMD0000000006'),
          ],
          [
            new JournalReference(['Karr, JR', 'Shaikh, B'], 'Journal', 101, 3, '10-20', 2019),
            new JournalReference(['Skaf, Y', 'Wilson, M'], 'Journal', 101, 3, '10-20', 2019),
          ],
          UserService._get(6),
          new Date(Date.parse('1991-08-15 00:00:00')),
        );
        break;
    }
    model.framework = new OntologyTerm('SBO', '0000062', 'continuous framework', null, 'http://biomodels.net/SBO/SBO_0000293');
    model.authors = [];
    model.access = AccessLevel.public;
    model.license = new License('CC0', 1000049);
    return model;
  }

  private getServices(): void {
    if (this.userService == null) {
      this.userService = this.injector.get(UserService);
      this.simulationService = this.injector.get(SimulationService);
      this.visualizationsService = this.injector.get(VisualizationsService);
    }
  }

  get(id: string): Model {
    this.getServices();
    return ModelService._get(id);
  }

  list(auth?): Model[] {
    const data: Model[] = [
      this.get('001'),
      this.get('003'),
      this.get('006'),
    ];
    return data;
  }
}

import { SimulationService } from './simulation.service';
import { VisualizationsService } from './visualizations.service';
