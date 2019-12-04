import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { Identifier } from '../Models/identifier';
import { JournalReference } from '../Models/journal-reference'
import { Person } from '../Models/person';
import { Project } from '../Models/project';
import { User } from '../Models/user';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private userService: UserService;
  private modelService: ModelService;
  private simulationService: SimulationService;
  private visualizationService: VisualizationService;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private injector: Injector) {}

  static _get(id: string, includeRelatedObjects = false): Project {
    let project: Project;

    switch (id) {
      default:
      case '001':
        project = new Project();
        project.id = id;
        project.name ='Demo project A';
        project.description = 'Description of demo project A.';
        project.tags = ['topic-1', 'topic-2'];
        project.identifiers = [
          new Identifier('github.repository', 'KarrLab/ProjectA'),
        ];
        project.refs = [
          new JournalReference('Karr JR & Shaikh B', 'Title', 'Journal', 101, 3, '10-20', 2019),
          new JournalReference('Skaf Y & Wilson M', 'Title', 'Journal', 101, 3, '10-20', 2019),
        ];
        project.owner = UserService._get('jonrkarr');
        project.access = AccessLevel.public;
        project.created = new Date(Date.parse('1996-11-01 00:00:00'));
        project.updated = new Date(Date.parse('1996-11-01 00:00:00'));
        break;

      case '002':
        project = new Project();
        project.id = id;
        project.name ='Demo project B';
        project.description = 'Description of demo project B.';
        project.tags = ['topic-1', 'topic-3'];
        project.identifiers = [
          new Identifier('github.repository', 'KarrLab/ProjectB'),
        ];
        project.refs = [
          new JournalReference('Karr JR & Shaikh B', 'Title', 'Journal', 101, 3, '10-20', 2019),
          new JournalReference('Skaf Y & Wilson M', 'Title', 'Journal', 101, 3, '10-20', 2019),
        ];
        project.owner = UserService._get('jonrkarr');
        project.access = AccessLevel.private;
        project.created = new Date(Date.parse('1996-11-01 00:00:00'));
        project.updated = new Date(Date.parse('1996-11-01 00:00:00'));
        break;

      case '003':
        project = new Project();
        project.id = '003';
        project.name ='Demo project C';
        project.description = 'Description of demo project C.';
        project.tags = ['topic-2', 'topic-4'];
        project.identifiers = [
          new Identifier('github.repository', 'KarrLab/ProjectC'),
        ];
        project.refs = [
          new JournalReference('Karr JR & Shaikh B', 'Title', 'Journal', 101, 3, '10-20', 2019),
          new JournalReference('Skaf Y & Wilson M', 'Title', 'Journal', 101, 3, '10-20', 2019),
        ];
        project.owner = UserService._get('a.goldbeter');
        project.access = AccessLevel.public;
        project.created = new Date(Date.parse('1991-10-15 00:00:00'));
        project.updated = new Date(Date.parse('1991-10-15 00:00:00'));
        break;

      case '006':
        project = new Project();
        project.id = '006';
        project.name ='Demo project D';
        project.description = 'Description of demo project D.';
        project.tags = ['topic-1', 'topic-5'];
        project.identifiers = [
          new Identifier('github.repository', 'KarrLab/ProjectD'),
        ];
        project.refs = [
          new JournalReference('Karr JR & Shaikh B', 'Title', 'Journal', 101, 3, '10-20', 2019),
          new JournalReference('Skaf Y & Wilson M', 'Title', 'Journal', 101, 3, '10-20', 2019),
        ];
        project.owner = UserService._get('j.tyson');
        project.access = AccessLevel.public;
        project.created = new Date(Date.parse('1991-08-15 00:00:00'));
        project.updated = new Date(Date.parse('1991-08-15 00:00:00'));
        break;
    }
    project.authors = [
          new Person('Jimmie', 'D', 'Doe'),
          new Person('Jane', 'E', 'Doe'),
        ];
    project.license = License.cc0;
    if (includeRelatedObjects) {
      project.models = [
        ModelService._get('001'),
        ModelService._get('003'),
        ModelService._get('006'),
      ];
      project.simulations = [
        SimulationService._get('001'),
        SimulationService._get('003'),
        SimulationService._get('006'),
      ];
    }
    return project;
  }

  private getServices(): void {
    if (this.userService == null) {
      this.userService = this.injector.get(UserService);
      this.modelService = this.injector.get(ModelService);
      this.simulationService = this.injector.get(SimulationService);
      this.visualizationService = this.injector.get(VisualizationService);
    }
  }

  get(id: string): Project {
    this.getServices();
    return ProjectService._get(id, true);
  }

  list(name?: string): Project[] {
    const data: Project[] = [
      this.get('001'),
      this.get('002'),
      this.get('003'),
      this.get('006'),
    ];
    return this.filter(data, undefined, name) as Project[];
  }

  private filter(list: object[], id?: string, name?: string): object[] {
    let lowCaseId: string;
    let lowCaseName: string;
    if (id) {
      lowCaseId = id.toLowerCase();
    }
    if (name) {
      lowCaseName = name.toLowerCase();
    }

    if (id || name) {
      return list.filter(item =>
        (id === undefined || item['id'].toLowerCase().includes(lowCaseId)) ||
        (name === undefined || item['name'].toLowerCase().includes(lowCaseName))
      );
    } else {
      return list;
    }
  }

  set(data: Project, id?: string): string {
    this.getServices();

    if (!id) {
      id = '007';
    }

    data.id = id;
    data.owner = this.userService.get();
    data.created = new Date(Date.now());
    data.updated = new Date(Date.now());

    return id;
  }

  delete(id?: string): void {}
}

import { ModelService } from './model.service';
import { SimulationService } from './simulation.service';
import { VisualizationService } from './visualization.service';
