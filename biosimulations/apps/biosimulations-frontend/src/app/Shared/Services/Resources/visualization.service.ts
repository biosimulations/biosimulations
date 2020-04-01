import { Injectable, Injector } from '@angular/core';

import { Visualization } from 'src/app/Shared/Models/visualization';

import { UserService } from 'src/app/Shared/Services/user.service';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResourceService } from './resource.service';

import { VisualizationSerializer } from 'src/app/Shared/Serializers/visualization-serializer';

@Injectable({
  providedIn: 'root',
})
export class VisualizationService extends ResourceService<Visualization> {
  private userService: UserService;

  constructor(private http: HttpClient, private injector: Injector) {
    super(http, 'visualizations', new VisualizationSerializer());
  }

  private vizUrl = 'https://crbm-test-api.herokuapp.com/vis/';

  getVisualization(id: string): Observable<any[]> {
    const vizJson = this.http.get<any[]>(
      this.vizUrl + '0'.repeat(3 - id.length) + id,
    );
    return vizJson;
  }

  getHistory(
    id: string,
    includeParents: boolean = true,
    includeChildren: boolean = true,
  ): object[] {
    // tslint:disable:max-line-length
    return [
      {
        id: '003',
        name: 'Grandparent',
        route: ['/visualizations', '003'],
        isExpanded: true,
        children: [
          {
            id: '002',
            name: 'Parent',
            route: ['/visualizations', '006'],
            isExpanded: true,
            children: [
              {
                id: '001',
                name: 'This visualization',
                route: ['/visualizations', '001'],
                isExpanded: true,
                children: [
                  {
                    id: '004',
                    name: 'Child-1',
                    route: ['/visualizations', '004'],
                    children: [
                      {
                        id: '005',
                        name: 'Grandchild-1-1',
                        route: ['/visualizations', '005'],
                        children: [],
                      },
                      {
                        id: '006',
                        name: 'Grandchild-1-2',
                        route: ['/visualizations', '006'],
                        children: [],
                      },
                    ],
                  },
                  {
                    id: '007',
                    name: 'Child-2',
                    route: ['/visualizations', '007'],
                    children: [
                      {
                        id: '008',
                        name: 'Grandchild-2-1',
                        route: ['/visualizations', '008'],
                        children: [],
                      },
                      {
                        id: '009',
                        name: 'Grandchild-2-2',
                        route: ['/visualizations', '009'],
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: '010',
                name: 'Sibling',
                route: ['/visualizations', '010'],
                children: [
                  {
                    id: '011',
                    name: 'Nephew',
                    route: ['/visualizations', '011'],
                    children: [],
                  },
                  {
                    id: '012',
                    name: 'Niece',
                    route: ['/visualizations', '012'],
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  }

  private filter(list: object[], name?: string): object[] {
    if (name) {
      const lowCaseName: string = name.toLowerCase();
      return list.filter(item =>
        item['name'].toLowerCase().includes(lowCaseName),
      );
    } else {
      return list;
    }
  }
}
