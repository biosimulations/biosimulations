import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  TableComponent,
  Column,
  ColumnLinkType,
  ColumnFilterType,
} from '@biosimulations/shared/ui';
import { SimulatorService } from '../simulator.service';
import edamJson from '../edam.json';
import kisaoJson from '../kisao.json';
import sboJson from '../sbo.json';
import spdxJson from '../spdx.json';
import { Observable, of, Subscription } from 'rxjs';
import { columns } from './browse-simulators.columns';
import { SimulatorTableService } from './simulator-table.service';
import { TableSimulator } from './tableSimulator.interface';
const edamTerms = edamJson as {
  [id: string]: { name: string; description: string; url: string };
};
const kisaoTerms = kisaoJson as {
  [id: string]: { name: string; description: string; url: string };
};
const sboTerms = sboJson as {
  [id: string]: { name: string; description: string; url: string };
};
const spdxTerms = spdxJson as { [id: string]: { name: string; url: string } };

@Component({
  selector: 'biosimulations-browse-simulators',
  templateUrl: './browse-simulators.component.html',
  styleUrls: ['./browse-simulators.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrowseSimulatorsComponent implements OnInit {
  @ViewChild(TableComponent) table!: TableComponent;
  columns = columns;
  data: Observable<TableSimulator[]> = of([]);

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
