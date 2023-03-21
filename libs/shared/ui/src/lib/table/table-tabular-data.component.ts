import { Component, Input, ViewChild } from '@angular/core';
import { MatLegacyTable as MatTable } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { TableComponent } from './table.component';
import { Column, TableDataComponent } from './table.interface';

@Component({
  selector: 'biosimulations-table-tabular-data',
  templateUrl: './table-tabular-data.component.html',
  styleUrls: ['./table-tabular-data.component.scss'],
})
export class TableTabularDataComponent implements TableDataComponent {
  @Input()
  table!: TableComponent;

  @Input()
  columns!: Column[];

  @Input()
  columnsToShow!: string[];

  @Input()
  columnIsFiltered!: { [id: string]: boolean };

  @Input()
  singleLineHeadings = false;

  @Input()
  sortable = true;

  @Input()
  linesPerRow = 1;

  @ViewChild(MatTable) materialTable!: MatTable<any>;
  @ViewChild(MatPaginator) materialPaginator!: MatPaginator;
  @ViewChild(MatSort) materialSort!: MatSort;
}
