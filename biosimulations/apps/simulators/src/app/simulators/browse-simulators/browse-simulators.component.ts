import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { TableComponent, Column, ColumnLinkType, ColumnFilterType } from '@biosimulations/shared/ui';

interface Simulator {
  id: string;
  name: string;
  frameworks: string[];
  algorithms: string[];
  algorithmSynonyms: string[];
  formats: string[];
  latestVersion: string;
  url: string;
  license: string;
  created: Date;
  updated: Date;
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
      rightIcon: 'link',
      iconTitle: (element: Simulator): string => {
        return element.name;
      },
      linkType: ColumnLinkType.href,
      href: (element: Simulator): string => {
        return element.url;
      },
      filterable: false
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
          return this.trimFramework(a).localeCompare( this.trimFramework(b), undefined, { numeric: true } )
        });
        return value;
      },
      formatter: (names: string[]): string => {
        return names.map(this.trimFramework).join(', ');
      },
      filterFormatter: (name: string): string => {
        return this.trimFramework(name);
      },
      comparator: (aNames: string[], bNames: string[], sign = 1): number => {
        return TableComponent.comparator(aNames.map(this.trimFramework).join(', '), bNames.map(this.trimFramework).join(', '), sign);
      },
      filterComparator: (aName: string, bName: string, sign = 1): number => {
        return TableComponent.comparator(this.trimFramework(aName), this.trimFramework(bName), sign);
      },
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
      passesFilter: (element: Simulator, filterValues: string[]): boolean => {
        const algorithms = element.algorithms;
        const algorithmSynonyms = element.algorithmSynonyms;
        for (const v of filterValues) {
          if (algorithms.includes(v)) {
            return true;
          }
          if (algorithmSynonyms.includes(v)) {
            return true;
          }
        }

        return false;
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
      filterable: false
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
      leftIcon: 'internalLink',
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
          frameworks: [
            'non-spatial continuous framework',
            'non-spatial discrete framework',
          ],
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
          algorithmSynonyms: [],
          formats: ['SBML'],
          latestVersion: '4.27.214',
          url: 'http://copasi.org',
          license: 'Artistic 2.0',
          created: new Date(2020, 9, 1),
          updated: new Date(2020, 9, 1),
        },
        {
          id: 'vcell',
          name: 'VCell',
          frameworks: [
            'non-spatial continuous framework',
            'non-spatial discrete framework',
          ],
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
          algorithmSynonyms: [],
          formats: ['SBML'],
          latestVersion: '7.2',
          url: 'https://vcell.org/',
          license: 'MIT',
          created: new Date(2020, 9, 1),
          updated: new Date(2020, 9, 1),
        },
        {
          id: 'tellurium',
          name: 'tellurium',
          frameworks: [
            'non-spatial continuous framework',
            'non-spatial discrete framework',
          ],
          algorithms: [
            'CVODE',
            'explicit fourth-order Runge-Kutta method',
            'Gillespie direct algorithm',
            'Newton-type method',
          ],
          algorithmSynonyms: [
            'ordinary Newton method',
            'simlified Newton method',
            'Newton-like method',
            'inexact Newton method',
            'exact Newton method',
            'IDA-like method'
          ],
          formats: ['SBML'],
          latestVersion: '2.4.1',
          url: 'http://tellurium.analogmachine.org/',
          license: 'Apache 2.0',
          created: new Date(2020, 9, 1),
          updated: new Date(2020, 9, 1),
        },
        {
          id: 'bionetgen',
          name: 'BioNetGen',
          frameworks: [
            'non-spatial continuous framework',
            'non-spatial discrete framework',
          ],
          algorithms: [
            'CVODE',
            'Gillespie direct algorithm',
            'NFSim agent-based simulation method',
          ],
          algorithmSynonyms: [],
          formats: ['BGNL'],
          latestVersion: '2.5.0',
          url: 'https://bionetgen.org',
          license: 'MIT',
          created: new Date(2020, 9, 1),
          updated: new Date(2020, 9, 1),
        },
      ];
      this.table.setData(this.data);
    });
  }

  trimFramework(name: string): string {    
    if (name.toLowerCase().endsWith(' framework')) {
      name = name.substring(0, name.length - 10);
    }
    return name;
  }
}
