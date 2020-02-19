import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject, Observable } from 'rxjs';
import { AlertService } from 'src/app/Shared/Services/alert.service';
import { UserService } from 'src/app/Shared/Services/user.service';
import { Simulation } from 'src/app/Shared/Models/simulation';

import { ResourceService } from './resource.service';
import { Serializer } from 'src/app/Shared/Serializers/serializer';
import { SimulationSerializer } from 'src/app/Shared/Serializers/simulation-serializer';
import { QueryOptions } from 'src/app/Shared/Models/query-options';

@Injectable({
  providedIn: 'root',
})
export class SimulationService extends ResourceService<Simulation> {
  constructor(private http: HttpClient) {
    super(http, 'simulations', new SimulationSerializer());
  }

  public list(
    queryParams: QueryOptions = new QueryOptions()
  ): Observable<Simulation[]> {
    queryParams.embed.push('model');

    return super.list(queryParams);
  }

  private filter(list: object[], name?: string): object[] {
    if (name) {
      const lowCaseName: string = name.toLowerCase();
      return list.filter(item =>
        item['name'].toLowerCase().includes(lowCaseName)
      );
    } else {
      return list;
    }
  }

  getHistory(
    id: string,
    includeParents: boolean = true,
    includeChildren: boolean = true
  ): object[] {
    // tslint:disable:max-line-length
    return [
      {
        id: '003',
        name: 'Grandparent',
        route: ['/simulations', '003'],
        isExpanded: true,
        children: [
          {
            id: '002',
            name: 'Parent',
            route: ['/simulations', '006'],
            isExpanded: true,
            children: [
              {
                id: '001',
                name: 'This simulation',
                route: ['/simulations', '001'],
                isExpanded: true,
                children: [
                  {
                    id: '004',
                    name: 'Child-1',
                    route: ['/simulations', '004'],
                    children: [
                      {
                        id: '005',
                        name: 'Grandchild-1-1',
                        route: ['/simulations', '005'],
                        children: [],
                      },
                      {
                        id: '006',
                        name: 'Grandchild-1-2',
                        route: ['/simulations', '006'],
                        children: [],
                      },
                    ],
                  },
                  {
                    id: '007',
                    name: 'Child-2',
                    route: ['/simulations', '007'],
                    children: [
                      {
                        id: '008',
                        name: 'Grandchild-2-1',
                        route: ['/simulations', '008'],
                        children: [],
                      },
                      {
                        id: '009',
                        name: 'Grandchild-2-2',
                        route: ['/simulations', '009'],
                        children: [],
                      },
                    ],
                  },
                ],
              },
              {
                id: '010',
                name: 'Sibling',
                route: ['/simulations', '010'],
                children: [
                  {
                    id: '011',
                    name: 'Nephew',
                    route: ['/simulations', '011'],
                    children: [],
                  },
                  {
                    id: '012',
                    name: 'Niece',
                    route: ['/simulations', '012'],
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
}
