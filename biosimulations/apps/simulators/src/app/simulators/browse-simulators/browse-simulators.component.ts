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
import { TableComponent } from '@biosimulations/shared/ui';
@Component({
  selector: 'biosimulations-browse-simulators',
  templateUrl: './browse-simulators.component.html',
  styleUrls: ['./browse-simulators.component.scss'],
  // providers: [SimulatorDataSource],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseSimulatorsComponent implements AfterViewInit {
  // data: SimulatorData[] = [];


  @ViewChild(TableComponent) table!: TableComponent;

  columns: any[] = [
    {
      id: 'name',
      heading: "Name",
      key: 'name',
      container: 'plain',      
    },
    {
      id: 'frameworks',
      heading: "Modeling frameworks",
      key: 'frameworks',
      container: 'plain',
      getter: (element: any): string[] => {
        const value = [];
        for (const framework of element.frameworks) {
          value.push(framework.name);
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
      heading: "Simulation algorithms",
      key: 'algorithms',
      container: 'plain',
      getter: (element: any): string[] => {
        const value = [];
        for (const framework of element.algorithms) {
          value.push(framework.name);
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
      container: 'plain',
      getter: (element: any): string[] => {
        const value = [];
        for (const framework of element.formats) {
          value.push(framework.name);
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
      id: 'moreInfo',
      heading: "More info",
      container: 'route',
      route: (element: any): string[] => {
        return ['/simulators', element.id];
      },
      icon: 'internalLink',
      minWidth: 66,
      center: true,      
      filterable: false,
      sortable: false,
    },    
  ];

  data: any[] = [
    {
      id: 'copasi',
      name: 'COPASI',
      frameworks: [{name: 'continuous kinetic'}],
      algorithms: [{name: 'cvode'}],
      formats: [{name: 'SBML'}],
    },
    {
      id: 'vcell',
      name: 'VCell',
      frameworks: [{name: 'continuous kinetic'}],
      algorithms: [{name: 'cvode'}],
      formats: [{name: 'CellML'}],
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
