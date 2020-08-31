import { Component, Input, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
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
  sortColumn!: string;
  sortDirection = '';

  @Input()
  set columns(columns: any[]) {
    columns.forEach((column) => {
      column._filteredValues = [];
    });
    this._columns = columns;
    this.setColumnsToShow();
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
  filteredData!: any[];

  setData(data: any[]): void {
    data.forEach((datum, iDatum) => {datum._index = iDatum});
    this.data = data;
    this.filterSortData();
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
    if ('key' in column) {
      if (column.key in element) {
        const value = element[column.key];
        if ('formatter' in column) {
          return column.formatter(value);
        } else {
          return value;
        }
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  getColumnValues(column: any): any[] {
    const values: any[] = [];
    for (const datum of this.data) {
      const value = datum[column.key];
      if (Array.isArray(value)) {
        for (const v of value) {
          if (v != null && v !== '') {
            values.push(v);
          }
        }
      } else if (value != null && value !== '') {
        values.push(value);
      }
    }

    let comparator;
    if ('comparator' in column) {
      comparator = column.comparator;
    } else {
      comparator = this.comparator;
    }
    values.sort(comparator);

    return values;
  }

  formatFilterValue(value: any, column: any): any {
    if ('filterFormatter' in column) {
      return column.filterFormatter(value);
    } else if ('formatter' in column) {
      return column.formatter(value);
    } else {
      return value;
    }
  }

  sortRows(event: Sort) {
    this.sortColumn = event.active;
    this.sortDirection = event.direction;
    this.sortData();
  }

  sortData() {
    this.filteredData.sort((a, b) => {
      let column;
      if (this.sortColumn) {
        column = this.idToColumn[this.sortColumn];
      }

      let key;
      if (this.sortDirection === '') {
        key = '_index';
      } else {
        key = column.key;
      }

      const aVal = a[key];
      const bVal = b[key];

      const sign = this.sortDirection !== "desc" ? 1 : -1;

      let comparator;
      if (this.sortDirection === '' || !('comparator' in column)) {
        comparator = this.comparator;
      } else {
        comparator = column.comparator;
      }

      return sign * comparator(aVal, bVal);
    });

    this.table.renderRows();
  }

  comparator(aVal:any, bVal:any): number {
    if (aVal > bVal) return 1;
    if (aVal < bVal) return -1;
    return 0;
  }

  toggleColumn(column: any): void {
    column.show = column.show === false;
    this.setColumnsToShow();
  }

  setColumnsToShow(): void {
    this.columnsToShow = this.columns
      .filter((col) => col.show !== false)
      .map((col) => col.id);
  }

  filterSetValue(column: any, value: any, show: boolean): void {
    if (show) {
      column._filteredValues.push(value);
    } else {
      column._filteredValues.splice(column._filteredValues.indexOf(value), 1);
    }

    this.filterSortData();
  }

  filterSortData() {
    // filter data
    this.filteredData = [];
    for (const datum of this.data) {
      let passesFilters = true;
      for (const column of this.columns) {
        if (column.filterable !== false && column._filteredValues.length > 0) {
          const value = datum[column.key];
          if (!column._filteredValues.includes(value)) {
            passesFilters = false;
            break;
          }
        }
      }
      if (passesFilters) {
        this.filteredData.push(datum);
      }
    }
    this.table.dataSource = this.filteredData;

    // sort data
    this.sortData();
  }
}
