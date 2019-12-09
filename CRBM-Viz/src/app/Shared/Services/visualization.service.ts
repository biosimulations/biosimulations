import { Injectable, Injector } from '@angular/core';
import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { JournalReference } from 'src/app/Shared/Models/journal-reference';
import { Visualization } from 'src/app/Shared/Models/visualization';
import { VisualizationSchema } from 'src/app/Shared/Models/visualization-schema';
import { AuthService } from 'src/app/Shared/Services/auth0.service';
import { UserService } from 'src/app/Shared/Services/user.service';
import { ProjectService } from 'src/app/Shared/Services/project.service';
import { SimulationService } from 'src/app/Shared/Services/simulation.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VisualizationService {
  private userService: UserService;
  private projectService: ProjectService;
  private simulationService: SimulationService;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private injector:Injector) {}

  private vizUrl = 'https://crbm-test-api.herokuapp.com/vis/';

  static _get(id: number, includeRelatedObjects = false): Visualization {
    const viz: Visualization = new Visualization();
    viz.id = id;
    viz.name = 'Viz-' + id.toString();
    viz.description = 'Visualization of a simulation of a model of a nicotinic Excitatory Post-Synaptic Potential in a Torpedo electric organ. Acetylcholine is not represented explicitely, but by an event that changes the constants of transition from unliganded to liganded.';
    viz.tags = ['tag-1', 'tag-2'];
    viz.parent = new Visualization();
    viz.parent.id = 5;
    viz.parent.name = 'Viz-005';
    viz.refs = [
      new JournalReference('Jonathan R Karr & Bilal Shaikh', 'Title', 'Journal', 101, 3, '10-20', 2019),
      new JournalReference('Yara Skaf & Mike Wilson', 'Title', 'Journal', 101, 3, '10-20', 2019),
    ];
    viz.owner = UserService._get('jonrkarr');
    viz.access = AccessLevel.private;
    viz.license = License.cc0;
    viz.created = new Date(Date.parse('2019-11-06 00:00:00'));
    viz.updated = new Date(Date.parse('2019-11-06 00:00:00'));
    if (includeRelatedObjects) {
      viz.projects = [
        ProjectService._get('001'),
        ProjectService._get('003'),
        ProjectService._get('006'),
      ];
    }
    return viz;
  }

  private getServices(): void {
    if (this.userService == null) {
      this.userService = this.injector.get(UserService);
      this.projectService = this.injector.get(ProjectService);
      this.simulationService = this.injector.get(SimulationService);
    }
  }

  get(id: number): Visualization {
    return VisualizationService._get(id, true);
  }

  getVisualization(id: number): Observable<any[]> {
    const vizJson = this.http.get<any[]>(this.vizUrl
      + '0'.repeat(3 - id.toString().length)
      + id.toString());
    return vizJson;
  }

  getHistory(id: number, includeParents: boolean = true, includeChildren: boolean = true): object[] {
    // tslint:disable:max-line-length
    return [
      {
        id: 3,
        name: 'Grandparent',
        route: ['/visualizations', 3],
        isExpanded: true,
        children: [
          {
            id: 2,
            name: 'Parent',
            route: ['/visualizations', 6],
            isExpanded: true,
            children: [
              {
                id: 1,
                name: 'This visualization',
                route: ['/visualizations', 1],
                isExpanded: true,
                children: [
                  {
                    id: 4,
                    name: 'Child-1',
                    route: ['/visualizations', 4],
                    children: [
                      {
                        id: 5,
                        name: 'Grandchild-1-1',
                        route: ['/visualizations', 5],
                        children: [],
                      },
                      {
                        id: 6,
                        name: 'Grandchild-1-2',
                        route: ['/visualizations', 6],
                        children: [],
                      },
                    ],
                  },
                  {
                    id: 7,
                    name: 'Child-2',
                    route: ['/visualizations', 7],
                    children: [
                      {
                        id: 8,
                        name: 'Grandchild-2-1',
                        route: ['/visualizations', 8],
                        children: [],
                      },
                      {
                        id: 9,
                        name: 'Grandchild-2-2',
                        route: ['/visualizations', 9],
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: 10,
                name: 'Sibling',
                route: ['/visualizations', 10],
                children: [
                  {
                    id: 11,
                    name: 'Nephew',
                    route: ['/visualizations', 11],
                    children: [],
                  },
                  {
                    id: 12,
                    name: 'Niece',
                    route: ['/visualizations', 12],
                    children: [],
                  },
                ]
              },
            ],
          },
        ],
      },
    ];
  }

  list(name?: string, owner?: string): Visualization[] {
    // TODO: filter on name, owner attributes
    const data: Visualization[] = [
      this.get(1),
      this.get(2),
      this.get(3),
      this.get(6),
    ];
    return this.filter(data, name) as Visualization[];
  }

  private filter(list: object[], name?: string): object[] {
    if (name) {
      const lowCaseName: string = name.toLowerCase();
      return list.filter(item => item['name'].toLowerCase().includes(lowCaseName));
    } else {
      return list;
    }
  }

  set(data: Visualization, id?: number): number {
    if (!id) {
      id = 7;
    }

    data.id = id;
    data.owner = this.userService.get();
    data.created = new Date(Date.now());
    data.updated = new Date(Date.now());

    return id;
  }

  delete(id?: number): void {}
}
