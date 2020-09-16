import {
  Component,
  AfterViewInit,
  ChangeDetectionStrategy,
  ViewChild,
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
export class BrowseSimulatorsComponent implements AfterViewInit {
  @ViewChild(TableComponent) table!: TableComponent;
  columns = columns;
  data: Observable<TableSimulator[]> = of([]);

  constructor(private service: SimulatorTableService) {}
  ngOnInit(): void {
    this.data = this.service.getData();
    this.data.subscribe((data) => console.log(data));
  }

  ngAfterViewInit(): void {
    this.table.defaultSort = { active: 'name', direction: 'asc' };
  }
}
