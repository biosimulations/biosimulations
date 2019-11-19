import { Injectable, Injector } from '@angular/core';
import { AccessLevel } from '../Enums/access-level';
import { Format } from '../Models/format';
import { Identifier } from '../Models/identifier';
import { JournalReference } from '../Models/journal-reference'
import { Model } from '../Models/model';
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
      case '001':
        model = new Model(
          '001',
          'EPSP ACh event',
          'Model of a nicotinic Excitatory Post-Synaptic Potential in a Torpedo electric organ. Acetylcholine is not represented explicitely, but by an event that changes the constants of transition from unliganded to liganded.',
          new Taxon(7787, 'Tetronarce californica'),
          ['neurotransmission', 'signaling'],
          new Format('SBML', 'L2V4'),
          [
            new Identifier('biomodels', 'BIOMD0000000001'),
            new Identifier('doi', '10.1007/s004220050302'),
            new Identifier('pubmed', '8983160'),
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
          new Format('SBML', 'L2V4'),
          [
            new Identifier('biomodels', 'BIOMD0000000003'),
            new Identifier('doi', '10.1073/pnas.88.20.9107'),
            new Identifier('pubmed', '1833774'),
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
          new Format('SBML', 'L2V4'),
          [
            new Identifier('biomodels', 'BIOMD0000000006'),
            new Identifier('doi', '10.1186/1752-0509-4-92'),
            new Identifier('pubmed', '20587024'),
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
    model.authors = [];
    model.access = AccessLevel.public;
    model.license = 'MIT';
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
