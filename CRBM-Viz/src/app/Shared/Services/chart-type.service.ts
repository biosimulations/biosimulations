import { Injectable, Injector } from '@angular/core';
import { AccessLevel } from '../Enums/access-level';
import { License } from '../Enums/license';
import { ChartType } from 'src/app/Shared/Models/chart-type';
import { Identifier } from 'src/app/Shared/Models/identifier';
import { JournalReference } from 'src/app/Shared/Models/journal-reference';
import { Person } from 'src/app/Shared/Models/person';
import { RemoteFile } from 'src/app/Shared/Models/remote-file';
import { UserService } from 'src/app/Shared/Services/user.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChartTypeService {
  private userService: UserService;

  constructor(
    private http: HttpClient,
    private injector:Injector) {}

  static _get(id: string, includeRelatedObjects = false): ChartType {
    const chartType: ChartType = new ChartType();
    chartType.id = id;
    chartType.spec = {
      $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
      data: {
        name: 'values',
        shape: 'array',
        type: 'dynamicSimulationResult',
        values: [
            {time: 0, value: 0, symbol: 'A'},
            {time: 100.0, value: 1, symbol: 'A'},
            {time: 0, value: 1, symbol: 'B'},
            {time: 100.0, value: 0, symbol: 'B'}
        ]
      },
      mark: {
        type: 'line',
        point: true
      },
      encoding: {
        x: {
          field: 'time',
          type: 'quantitative'
        },
        y: {
          field: 'value',
          type: 'quantitative'
        },
        color: {
          field: 'symbol',
          type: 'nominal'
        }
      }
    };
    chartType.name = 'Chart type ' + id;

    if (id === '002') {
      chartType.image = new RemoteFile()
      chartType.image.name = 'visualization.png';
      chartType.image.type = 'image/png';
      chartType.image.size = 3986;
      chartType.image.url = 'assets/examples/visualization-image.png';
    }

    chartType.description = 'Schema for a visualization of a simulation of a model of a nicotinic Excitatory Post-Synaptic Potential in a Torpedo electric organ. Acetylcholine is not represented explicitely, but by an event that changes the constants of transition from unliganded to liganded.';
    chartType.tags = ['tag-1', 'tag-2'];
    chartType.identifiers = [
        new Identifier('biomodels.db', 'BIOMD0000000001'),
      ];
    chartType.refs = [
      new JournalReference('Jonathan R Karr & Bilal Shaikh', 'Title', 'Journal', 101, 3, '10-20', 2019),
      new JournalReference('Yara Skaf & Mike Wilson', 'Title', 'Journal', 101, 3, '10-20', 2019),
    ];
    chartType.authors = [
      new Person('Jimmie', 'D', 'Doe'),
      new Person('Jane', 'E', 'Doe'),
    ];
    chartType.owner = UserService._get('jonrkarr');
    chartType.access = AccessLevel.private;
    chartType.license = License.cc0;
    chartType.created = new Date(Date.parse('2019-11-06 00:00:00'));
    chartType.updated = new Date(Date.parse('2019-11-06 00:00:00'));
    return chartType;
  }

  private getServices(): void {
    if (this.userService == null) {
      this.userService = this.injector.get(UserService);
    }
  }

  get(id: string): ChartType {
    return ChartTypeService._get(id, true);
  }

  list(name?: string, owner?: string): ChartType[] {
    // TODO: filter on name, owner attributes
    const data: ChartType[] = [
      this.get('001'),
      this.get('002'),
      this.get('003'),
      this.get('006'),
    ];
    return this.filter(data, name) as ChartType[];
  }

  private filter(list: object[], name?: string): object[] {
    if (name) {
      const lowCaseName: string = name.toLowerCase();
      return list.filter(item => item['name'].toLowerCase().includes(lowCaseName));
    } else {
      return list;
    }
  }

  set(data: ChartType, id?: string): string {
    if (!id) {
      // assign new ID
    }

    data.id = id;
    data.owner = this.userService.get();
    data.created = new Date(Date.now());
    data.updated = new Date(Date.now());

    return id;
  }

  delete(id?: string): void {}
}
