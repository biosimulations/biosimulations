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
@Component({
  selector: 'biosimulations-browse-simulators',
  templateUrl: './browse-simulators.component.html',
  styleUrls: ['./browse-simulators.component.scss'],
  // providers: [SimulatorDataSource],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseSimulatorsComponent implements AfterViewInit {
  // data: SimulatorData[] = [];


  @ViewChild('table') table!: any;

  columns: any[] = [
    {
      id: 'name',
      heading: "Name",
      key: 'name',
      container: 'route',
      route: (element: any) => {
        return ['/simulators', element.id];
      },
      icon: 'simulator',
    },
    {
      id: 'frameworks',
      heading: "Modeling frameworks",
      key: 'frameworks',
      container: 'plain',
      formatter: (frameworks: any[]) => {
        const value = [];
        for (const framework of frameworks) {
          value.push(framework.name);
        }
        value.sort((a, b) => {
          a.localeCompare( b, undefined, { numeric: true } )
        });
        return value.join(', ');
      },
    },
    {
      id: 'algorithms',
      heading: "Simulation algorithms",
      key: 'algorithms',
      container: 'plain',
      formatter: (algorithms: any[]) => {
        const value = [];
        for (const algorithm of algorithms) {
          value.push(algorithm.name);
        }
        value.sort((a, b) => {
          a.localeCompare( b, undefined, { numeric: true } )
        });
        return value.join(', ');
      },
    },
    {
      id: 'formats',
      heading: "Model formats",
      key: 'formats',
      container: 'plain',
      formatter: (formats: any[]) => {
        const value = [];
        for (const format of formats) {
          value.push(format.name);
        }
        value.sort((a, b) => {
          a.localeCompare( b, undefined, { numeric: true } )
        });
        return value.join(', ');
      },
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
      formats: [{name: 'SBML'}],
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
