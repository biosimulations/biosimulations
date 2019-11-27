import { Injectable, Injector } from '@angular/core';
import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { Format } from '../Models/format';
import { Identifier } from '../Models/identifier';
import { JournalReference } from '../Models/journal-reference'
import { Model } from '../Models/model';
import { OntologyTerm } from '../Models/ontology-term';
import { Person } from '../Models/person';
import { Taxon } from '../Models/taxon';
import { User } from '../Models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ModelService {
  private userService: UserService;
  private simulationService: SimulationService;
  private visualizationService: VisualizationService;

  constructor(private injector: Injector) {}

  static _get(id: string, includeRelatedObjects = false): Model {
    let model: Model;

    switch (id) {
      default:
      case '001':
        model = new Model();
        model.id = id;
        model.name ='EPSP ACh event';
        model.description = 'Model of a nicotinic Excitatory Post-Synaptic Potential in a Torpedo electric organ. Acetylcholine is not represented explicitely, but by an event that changes the constants of transition from unliganded to liganded.';
        model.taxon = new Taxon(7787, 'Tetronarce californica');
        model.tags = ['neurotransmission', 'signaling'];
        model.format = new Format('SBML', 'L2V4', 2585, 'http://sbml.org');
        model.identifiers = [
          new Identifier('biomodels.db', 'BIOMD0000000001'),
        ];
        model.refs = [
          new JournalReference('Karr JR & Shaikh B', 'Journal', 101, 3, '10-20', 2019),
          new JournalReference('Skaf Y & Wilson M', 'Journal', 101, 3, '10-20', 2019),
        ];
        model.owner = UserService._get('jonrkarr');
        model.created = new Date(Date.parse('1996-11-01 00:00:00'));
        model.updated = new Date(Date.parse('1996-11-01 00:00:00'));
        break;

      case '003':
        model = new Model();
        model.id = '003';
        model.name = 'Min Mit Oscil';
        model.description = 'Minimal cascade model for the mitotic oscillator involving cyclin and cdc2 kinase.';
        model.taxon = new Taxon(8292, 'Xenopus laevis');
        model.tags = ['cell cycle', 'mitosis'];
        model.format = new Format('SBML', 'L2V4', 2585, 'http://sbml.org');
        model.identifiers = [
          new Identifier('biomodels.db', 'BIOMD0000000003'),
        ];
        model.refs = [
          new JournalReference('Karr JR & Shaikh B', 'Journal', 101, 3, '10-20', 2019),
          new JournalReference('Skaf Y & Wilson M', 'Journal', 101, 3, '10-20', 2019),
        ];
        model.owner = UserService._get('a.goldbeter');
        model.created = new Date(Date.parse('1991-10-15 00:00:00'));
        model.updated = new Date(Date.parse('1991-10-15 00:00:00'));
        break;

      case '006':
        model = new Model();
        model.id = '006';
        model.name = 'Cell Cycle 6 var';
        model.description = 'Mathematical model of the interactions of cdc2 and cyclin.';
        model.taxon = new Taxon(33154, 'Homo sapiens');
        model.tags = ['cell cycle'];
        model.format = new Format('SBML', 'L2V4', 2585, 'http://sbml.org');
        model.identifiers = [
          new Identifier('biomodels.db', 'BIOMD0000000006'),
        ];
        model.refs = [
          new JournalReference('Karr JR & Shaikh B', 'Journal', 101, 3, '10-20', 2019),
          new JournalReference('Skaf Y & Wilson M', 'Journal', 101, 3, '10-20', 2019),
        ];
        model.owner = UserService._get('j.tyson');
        model.created = new Date(Date.parse('1991-08-15 00:00:00'));
        model.updated = new Date(Date.parse('1991-08-15 00:00:00'));
        break;
    }
    model.framework = new OntologyTerm('SBO', '0000062', 'continuous framework', null, 'http://biomodels.net/SBO/SBO_0000293');
    model.authors = [
          new Person('Jimmie', 'D', 'Doe'),
          new Person('Jane', 'E', 'Doe'),
        ];
    model.access = AccessLevel.public;
    model.license = License.cc0;
    if (includeRelatedObjects) {
      model.simulations = [
        SimulationService._get('001'),
        SimulationService._get('003'),
        SimulationService._get('006'),
      ];
    }
    return model;
  }

  private getServices(): void {
    if (this.userService == null) {
      this.userService = this.injector.get(UserService);
      this.simulationService = this.injector.get(SimulationService);
      this.visualizationService = this.injector.get(VisualizationService);
    }
  }

  get(id: string): Model {
    this.getServices();
    return ModelService._get(id, true);
  }

  list(auth?): Model[] {
    const data: Model[] = [
      this.get('001'),
      this.get('003'),
      this.get('006'),
    ];
    return data;
  }

  save(id: string, modelData: Model): string {
    this.getServices();

    if (!id) {
      id = '007';
    }

    modelData.format = new Format('SBML', 'L2V4', 2585, 'http://sbml.org');
    modelData.owner = this.userService.get();
    modelData.created = new Date(Date.now());
    modelData.updated = new Date(Date.now());

    return id;
  }

  publish(model: Model): void {
    model.access = AccessLevel.public;
  }
}

import { SimulationService } from './simulation.service';
import { VisualizationService } from './visualization.service';
