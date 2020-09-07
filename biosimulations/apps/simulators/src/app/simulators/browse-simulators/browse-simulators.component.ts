import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TableComponent, Column, ColumnLinkType, ColumnFilterType } from '@biosimulations/shared/ui';


interface Simulator {
  id: string,
  name: string,
  frameworks: string[],
  algorithms: string[],
  formats: string[],
  latestVersion: string,
  license: string,
  created: Date,
  updated: Date,
}

@Component({
  selector: 'biosimulations-browse-simulators',
  templateUrl: './browse-simulators.component.html',
  styleUrls: ['./browse-simulators.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseSimulatorsComponent implements AfterViewInit {
  @ViewChild(TableComponent) table!: TableComponent;

  columns: Column[] = [
    {
      id: 'name',
      heading: "Name",
      key: 'name',
    },
    {
      id: 'frameworks',
      heading: "Frameworks",
      key: 'frameworks',
      getter: (element: Simulator): string[] => {
        const value = [];
        for (const framework of element.frameworks) {
          value.push(framework);
        }
        value.sort((a: string, b: string): number => {
          return a.localeCompare( b, undefined, { numeric: true } )
        });
        return value;
      },
      formatter: (names: string[]): string => {
        return names.join(', ');
      },
      filterFormatter: (name: string): string => {
        return name;
      },
      comparator: (aNames: string[], bNames: string[], sign = 1): number => {
        return TableComponent.comparator(aNames.join(', '), bNames.join(', '), sign);
      },
      filterComparator: TableComponent.comparator,
      minWidth: 140,
    },
    {
      id: 'algorithms',
      heading: "Algorithms",
      key: 'algorithms',
      getter: (element: Simulator): string[] => {
        const value = [];
        for (const algorithm of element.algorithms) {
          value.push(algorithm);
        }
        value.sort((a: string, b: string): number => {
          return a.localeCompare( b, undefined, { numeric: true } )
        });
        return value;
      },
      formatter: (names: string[]): string => {
        return names.join(', ');
      },
      filterFormatter: (name: string): string => {
        return name;
      },
      comparator: (aNames: string[], bNames: string[], sign = 1): number => {
        return TableComponent.comparator(aNames.join(', '), bNames.join(', '), sign);
      },
      filterComparator: TableComponent.comparator,
      minWidth: 300,
    },
    {
      id: 'formats',
      heading: "Model formats",
      key: 'formats',
      getter: (element: Simulator): string[] => {
        const value = [];
        for (const format of element.formats) {
          value.push(format);
        }
        value.sort((a: string, b: string): number => {
          return a.localeCompare( b, undefined, { numeric: true } )
        });
        return value;
      },
      formatter: (names: string[]): string => {
        return names.join(', ');
      },
      filterFormatter: (name: string): string => {
        return name;
      },
      comparator: (aNames: string[], bNames: string[], sign = 1): number => {
        return TableComponent.comparator(aNames.join(', '), bNames.join(', '), sign);
      },
      filterComparator: TableComponent.comparator,
      minWidth: 114,
    },
    {
      id: 'latestVersion',
      heading: "Latest version",
      key: 'latestVersion',
      minWidth: 110,
    },
    {
      id: 'license',
      heading: "License",
      key: 'license',
      show: false,
      minWidth: 75,
    },
    {
      id: 'created',
      heading: "Created",
      key: 'created',
      formatter: (value: Date): string => {
        return value.getFullYear().toString()
          + '-' + (value.getMonth() + 1).toString().padStart(2, '0')
          + '-' + value.getDate().toString().padStart(2, '0');
      },
      filterType: ColumnFilterType.date,
      show: false,
    },
    {
      id: 'updated',
      heading: "Updated",
      key: 'updated',
      formatter: (value: Date): string => {
        return value.getFullYear().toString()
          + '-' + (value.getMonth() + 1).toString().padStart(2, '0')
          + '-' + value.getDate().toString().padStart(2, '0');
      },
      filterType: ColumnFilterType.date,
      show: false,
    },
    {
      id: 'moreInfo',
      heading: "More info",
      linkType: ColumnLinkType.routerLink,
      routerLink: (element: any): string[] => {
        return ['/simulators', element.id];
      },
      icon: 'internalLink',
      minWidth: 66,
      center: true,
      filterable: false,
      sortable: false,
    },
  ];

  data: Simulator[] = [];

  constructor(
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.table.defaultSort = {active: 'name', direction: 'asc'};

    setTimeout(() => {
      this.data = [
        {
          id: 'copasi',
          name: 'COPASI',
          frameworks: ['continuous kinetic', 'discrete kinetic'],
          algorithms: [
            'LSODAR',
            'Radau method',
            'Gibson-Bruck next reaction algorithm',
            'sorting stochastic simulation algorithm',
            'tau-leaping method',
            'adaptive explicit-implicit tau-leaping method',
            'LSODA',
            'Fehlberg method',
            'Gauss-Legendre Runge-Kutta method',
          ],
          formats: ['SBML'],
          latestVersion: '4.27.214',
          license: 'Artistic 2.0',
          created: new Date(2020, 9, 1),
          updated: new Date(2020, 9, 1),
        },
        {
          id: 'vcell',
          name: 'VCell',
          frameworks: ['continuous kinetic', 'discrete kinetic'],
          algorithms: [
            'CVODE',
            'Runge-Kutta based method',
            'Euler forward method',
            'explicit fourth-order Runge-Kutta method',
            'Fehlberg method',
            'Adams-Moulton method',
            'IDA',
            'Gibson-Bruck next reaction algorithm',
            'hybrid method',
            'finite volume method',
            'Brownian diffusion Smoluchowski method',
          ],
          formats: ['SBML'],
          latestVersion: '7.2',
          license: 'MIT',
          created: new Date(2020, 9, 1),
          updated: new Date(2020, 9, 1),
        },
        {
          id: 'tellurium',
          name: 'tellurium',
          frameworks: ['continuous kinetic', 'discrete kinetic'],
          algorithms: [
            'CVODE',
            'explicit fourth-order Runge-Kutta method',
            'Gillespie direct algorithm',
            'Newton-type method',
         ],
          formats: ['SBML'],
          latestVersion: '2.4.1',
          license: 'Apache 2.0',
          created: new Date(2020, 9, 1),
          updated: new Date(2020, 9, 1),
        },
        {
          id: 'bionetgen',
          name: 'BioNetGen',
          frameworks: ['continuous kinetic', 'discrete kinetic'],
          algorithms: [
            'CVODE',
            'Gillespie direct algorithm',
            'NFSim agent-based simulation method',
          ],
          formats: ['BGNL'],
          latestVersion: '2.5.0',
          license: 'MIT',
          created: new Date(2020, 9, 1),
          updated: new Date(2020, 9, 1),
        },
      ];
      this.table.setData(this.data);
    });
  }
}
