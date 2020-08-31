import { Component, Input, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'biosimulations-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @ViewChild(MatTable) table!: MatTable<any>;

  private _columns!: any[];
  columnsToShow!: string[];
  idToColumn!: any;

  @Input()
  set columns(columns: any[]) {
    this._columns = columns;
    this.columnsToShow = columns
      .filter((col) => col.show !== false)
      .map((col) => col.id);
    this.idToColumn = columns.reduce(function(map, obj) {
      map[obj.id] = obj;
      return map;
    }, {});
    
    if (this.table) {
      this.table.renderRows();
    }
  }

  get columns(): any[] {
    return this._columns;
  }

  data!: any[];

  setData(data: any[]): void {
    data.forEach((datum, iDatum) => {datum._index = iDatum});
    this.table.dataSource = data;
    
    if (this.table) {
      this.table.renderRows();
    }
  }

  constructor() {}

  getElementRoute(element: any, column: any): any {
    if ('route' in column) {
      return column.route(element);
    } else {
      return null;
    }
  }

  getElementHref(element: any, column: any): any {
    if ('href' in column) {
      return column.href(element);
    } else {
      return null;
    }
  }

  formatElementValue(element: any, column: any): any {
    if ('formatter' in column) {
      return column.formatter(element);
    } else if ('key' in column) {
      return element[column.key];
    } else {
      return null;
    }
  }

  dropColumn(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.columnsToShow,
      event.previousIndex,
      event.currentIndex,
    );
  }

  sortRows(event: Sort) {
    this.data.sort((a, b) => {
      let key;
      const column = this.idToColumn[event.active];

      if (event.direction === '') {
        key = '_index';
      } else {
        key = column.key;
      }

      const aVal = a[key];
      const bVal = b[key];

      const sign = event.direction !== "desc" ? 1 : -1;

      let comparator;
      if (event.direction === '' || !('comparator' in column)) {        
        comparator = this.comparator;
      } else {
        comparator = column.comparator;
      }

      return sign * comparator(aVal, bVal);
    });

    this.table.renderRows();
  }

  comparator (aVal:any, bVal:any): number {
    if (aVal > bVal) return 1;
    if (aVal < bVal) return -1;
    return 0;
  }
}
