import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
// import { SimulatorData, SimulatorDataSource } from './simulators-datasource';
// import { SimulatorHttpService } from '../services/simulator-http.service';
import { of, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { TableComponent, Column, ColumnLinkType, ColumnFilterType } from '@biosimulations/shared/ui';


interface ISimulator {
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
  // providers: [SimulatorDataSource],
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
      getter: (element: ISimulator): string[] => {
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
    },
    {
      id: 'algorithms',
      heading: "Algorithms",
      key: 'algorithms',
      getter: (element: ISimulator): string[] => {
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
    },
    {
      id: 'formats',
      heading: "Model formats",
      key: 'formats',
      getter: (element: ISimulator): string[] => {
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
    },
    {
      id: 'latestVersion',
      heading: "Latest version",
      key: 'latestVersion',
    },
    {
      id: 'license',
      heading: "License",
      key: 'license',
      show: false,
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

  data: ISimulator[] = [
    {
      id: 'copasi',
      name: 'COPASI',
      frameworks: ['continuous kinetic', 'discrete kinetic'],
      algorithms: ['cvode'],
      formats: ['SBML', 'CopasiML'],
      latestVersion: '4.6',
      license: 'Artistic 2.0',
      created: new Date(2020, 8, 1),
      updated: new Date(2020, 9, 1),
    },
    {
      id: 'vcell',
      name: 'VCell',
      frameworks: ['continuous kinetic', 'discrete kinetic'],
      algorithms: ['cvode'],
      formats: ['SBML', 'VCellML'],
      latestVersion: '2.3',
      license: 'MIT',
      created: new Date(2020, 8, 2),
      updated: new Date(2020, 9, 2),
    },
  ];

  constructor(
    // public dataSource: SimulatorDataSource,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngAfterViewInit() {
    this.table.setData(this.data);
  }
}
