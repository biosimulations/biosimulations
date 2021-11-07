import {
  Component,
  ViewChild,
  OnInit,
} from '@angular/core';
import { TableComponent } from '@biosimulations/shared/ui';

import { Observable } from 'rxjs';
import { columns } from './browse-simulators.columns';
import { SimulatorTableService } from './simulator-table.service';
import { TableSimulator } from './tableSimulator.interface';

@Component({
  selector: 'biosimulations-browse-simulators',
  templateUrl: './browse-simulators.component.html',
  styleUrls: ['./browse-simulators.component.scss'],
  providers: [],
})
export class BrowseSimulatorsComponent implements OnInit {
  @ViewChild(TableComponent) table!: TableComponent;
  columns = columns;

  data!: Observable<TableSimulator[]>;

  constructor(private service: SimulatorTableService) {}

  ngOnInit(): void {
    this.data = this.service.getData();
  }

  getStackedHeading(simulator: TableSimulator): string {
    return simulator.name + ' (' + simulator.id + ')';
  }

  getStackedHeadingMoreInfoRouterLink(simulator: TableSimulator): string[] {
    return ['/simulators', simulator.id];
  }
}
