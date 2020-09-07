import { Component, Input, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

export enum ColumnLinkType {
  routerLink = 'routerLink',
  href = 'href',
}

export enum ColumnFilterType {
  string = 'string',
  number = 'number',
  date = 'date',
}

export interface Column {
  id: string;
  heading: string;
  key?: string | string[];
  getter?: (rowData: any) => any;
  filterGetter?: (rowData: any) => any;
  formatter?: (cellValue: any) => any;
  filterFormatter?: (cellValue: any) => any;
  icon?: string;
  linkType?: ColumnLinkType;
  routerLink?: (rowData: any) => any[] | null;
  href?: (rowData: any) => string | null;
  minWidth?: number;
  center?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  comparator?: (a: any, b: any, sign: number) => number;
  filterComparator?: (a: any, b: any, sign: number) => number;
  filterType?: ColumnFilterType;
  numericFilterStep?: number;
  show?: boolean;
  _filteredValues?: any[];
}

@Component({
  selector: 'biosimulations-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  @ViewChild(MatTable) table!: MatTable<any>;

  private _columns!: Column[];
  columnsToShow!: string[];
  idToColumn!: { [id: string] : Column };
  sortColumnId!: string;
  sortDirection = '';

  @Input()
  set columns(columns: Column[]) {
    columns.forEach((column: Column): void => {
      column._filteredValues = [];
    });
    this._columns = columns;
    this.setColumnsToShow();
    this.idToColumn = columns.reduce((map: { [id: string] : Column }, col: Column) => {
      map[col.id] = col;
      return map;
    }, {});

    if (this.table) {
      this.table.renderRows();
    }
  }

  get columns(): Column[] {
    return this._columns;
  }

  data!: any[];
  filteredData!: any[];

  setData(data: any[]): void {
    data.forEach((datum: any, iDatum: number): void => {datum._index = iDatum});
    this.data = data;
    this.filterSortData();
  }

  constructor() {}

  getElementRouterLink(element: any, column: Column): any {
    if (column.linkType === ColumnLinkType.routerLink && column.routerLink !== undefined) {
      return column.routerLink(element);
    } else {
      return null;
    }
  }

  getElementHref(element: any, column: Column): any {
    if (column.linkType === ColumnLinkType.href && column.href !== undefined) {
      return column.href(element);
    } else {
      return null;
    }
  }

  getElementValue(element: any, column: Column | undefined, defaultKey?: string | undefined): any {
    if (column !== undefined && column.getter !== undefined) {
      return column.getter(element);
    } else if (column !== undefined && column.key != undefined) {
      let keys;
      if (Array.isArray(column.key)) {
        keys = column.key;
      } else {
        keys = [column.key];
      }

      let value = element;
      for (const key of keys) {
        if (key in value) {
          value = value[key];
        } else {
          return null;
        }
      }
      return value;
    } else if (defaultKey !== undefined) {
      if (defaultKey in element) {
        return element[defaultKey];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  getElementFilterValue(element: any, column: Column | undefined, defaultKey?: string | undefined): any {
    if (column !== undefined && column.filterGetter !== undefined) {
      return column.filterGetter(element);
    } else if (column !== undefined && column.getter !== undefined) {
      return column.getter(element);
    } else if (column !== undefined && column.key !== undefined) {
      let keys;
      if (Array.isArray(column.key)) {
        keys = column.key;
      } else {
        keys = [column.key];
      }

      let value = element;
      for (const key of keys) {
        if (key in value) {
          value = value[key];
        } else {
          return null;
        }
      }
      return value;
    } else if (defaultKey !== undefined) {
      if (defaultKey in element) {
        return element[defaultKey];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  getComparator(column: Column | undefined, useDefault = false): any {
    if (useDefault || column === undefined) {
      return TableComponent.comparator;
    } else if (column.comparator !== undefined) {
      return column.comparator;
    } else {
      return TableComponent.comparator;
    }
  }

  getFilterComparator(column: Column | undefined, useDefault = false): any {
    if (useDefault || column === undefined) {
      return TableComponent.comparator;
    } else if (column.filterComparator !== undefined) {
      return column.filterComparator;
    } else if (column.comparator !== undefined) {
      return column.comparator;
    } else {
      return TableComponent.comparator;
    }
  }

  formatElementValue(value: any, column: Column): any {
    if (column.formatter !== undefined) {
      return column.formatter(value);
    } else {
      return value;
    }
  }

  formatElementFilterValue(value: any, column: Column): any {
    if (column.filterFormatter !== undefined) {
      return column.filterFormatter(value);
    } else if (column.formatter !== undefined) {
      return column.formatter(value);
    } else {
      return value;
    }
  }

  getTextColumnValues(column: Column): any[] {
    const values: any = {};
    for (const datum of this.data) {
      const value: any = this.getElementFilterValue(datum, column);

      if (Array.isArray(value)) {
        for (const v of value) {
          const formattedV = this.formatElementFilterValue(v, column);
          if (formattedV != null && formattedV !== '') {
            values[v] = formattedV;
          }
        }
      } else {
        const formattedValue = this.formatElementFilterValue(value, column);
        if (formattedValue != null && formattedValue !== '') {
          values[value] = formattedValue;
        }
      }
    }

    const comparator = this.getFilterComparator(column);
    const arrValues = Object.keys(values).map((key: any): any => {
      return {value: key, formattedValue: values[key]};
    });
    arrValues.sort((a: any, b: any): number => {
      return comparator(a.formattedValue, b.formattedValue);
    });
    return arrValues.map((el: any): any => {return el.value});
  }

  getNumericColumnRange(column: Column): any {
    if (this.data.length === 0) {
      return {min: null, max: null, step: null};
    }

    const range: any = {
      min: null,
      max: null,
      step: null,
    }

    for (const datum of this.data) {
      const value = this.getElementFilterValue(datum, column);
      if (value == null || value === undefined) {
        continue;
      }

      if (range.min == null) {
        range.min = value;
        range.max = value;
      } else {
        if (value < range.min) {
          range.min = value;
        }
        if (value > range.max) {
          range.max = value;
        }
      }
    }

    if (column.numericFilterStep !== undefined) {
      range.step = column.numericFilterStep;
    } else if (range.max === range.min) {
      range.step = 0;
    } else {
      range.step = Math.pow(10, Math.floor(Math.log10((range.max - range.min) / 1000)));
    }

    return range;
  }

  formatFilterValue(value: any, column: Column): any {
    if (column.filterFormatter !== undefined) {
      return column.filterFormatter(value);
    } else if (column.formatter !== undefined) {
      return column.formatter(value);
    } else {
      return value;
    }
  }

  sortRows(event: Sort) {
    this.sortColumnId = event.active;
    this.sortDirection = event.direction;
    this.sortData();
  }

  sortData() {
    this.filteredData.sort((a: any, b: any): number => {
      let defaultKey: string | undefined = undefined;
      let column: Column | undefined = undefined;
      if (this.sortDirection === '') {
        defaultKey = '_index';
      } else if (this.sortColumnId) {
        column = this.idToColumn[this.sortColumnId];
      }

      const aVal = this.getElementValue(a, column, defaultKey);
      const bVal = this.getElementValue(b, column, defaultKey);

      const sign = this.sortDirection !== "desc" ? 1 : -1;

      const comparator = this.getComparator(column, this.sortDirection === '');
      return sign * comparator(aVal, bVal, sign);
    });

    this.table.renderRows();
  }

  static comparator(a:any, b:any, sign = 1): number {
    if (a == null) {
      if (b == null) {
        return 0;
      } else {
        return 1 * sign;
      }
    } else if (b == null) {
      return -1 * sign;
    }

    if (typeof a === "string") {
      return a.localeCompare(b , undefined, { numeric: true } );
    }

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }

  toggleColumn(column: Column): void {
    column.show = column.show === false;
    this.setColumnsToShow();
  }

  setColumnsToShow(): void {
    this.columnsToShow = this.columns
      .filter((col: Column): any => col.show !== false)
      .map((col: Column): string => col.id);
  }

  filterSetValue(column: Column, value: any, show: boolean): void {
    if (column._filteredValues === undefined) {
      column._filteredValues = [];
    }

    if (show) {
      column._filteredValues.push(value);
    } else {
      column._filteredValues.splice(column._filteredValues.indexOf(value), 1);
    }

    this.filterSortData();
  }

  filterNumberValue(column: Column, fullRange: any, selectedRange: number[]): void {
    if (fullRange.min === selectedRange[0] && fullRange.max === selectedRange[1]) {
      column._filteredValues = [];
    } else {
      column._filteredValues = selectedRange;
    }
    this.filterSortData();
  }

  filterStartDateValue(column: Column, event: MatDatepickerInputEvent<Date>): void {
    if (event.value === null) {
      if (column._filteredValues !== undefined && column._filteredValues.length > 0) {
        if (column._filteredValues[1] == null) {
          column._filteredValues = [];
        } else {
          column._filteredValues[0] = null;
        }
      }
    } else {
      if (column._filteredValues === undefined || column._filteredValues.length === 0) {
        column._filteredValues = [event.value, null];
      } else {
        column._filteredValues[0] = event.value;
      }
    }
    this.filterSortData();
  }

  filterEndDateValue(column: Column, event: MatDatepickerInputEvent<Date>): void {
    if (event.value === null) {
      if (column._filteredValues !== undefined && column._filteredValues.length > 0) {
        if (column._filteredValues[0] == null) {
          column._filteredValues = [];
        } else {
          column._filteredValues[1] = null;
        }
      }
    } else {
      if (column._filteredValues === undefined || column._filteredValues.length === 0) {
        column._filteredValues = [null, event.value];
      } else {
        column._filteredValues[1] = event.value;
      }
    }
    this.filterSortData();
  }

  filterSortData() {
    // filter data
    this.filteredData = [];
    for (const datum of this.data) {
      let passesFilters = true;
      for (const column of this.columns) {
        if (column.filterable !== false && column._filteredValues !== undefined && column._filteredValues.length > 0) {
          const value = this.getElementFilterValue(datum, column);

          if (column.filterType === ColumnFilterType.number) {
            if (value == null
              || value === undefined
              || (column._filteredValues[0] != null && value < column._filteredValues[0])
              || (column._filteredValues[1] != null && value > column._filteredValues[1])
              ) {
              passesFilters = false;
              break;
            }

          } else if (column.filterType === ColumnFilterType.date) {
            const startDate = column._filteredValues[0];
            const endDate = column._filteredValues[1];
            if (endDate != null) {
              endDate.setDate(endDate.getDate() + 1);
            }

            if (value == null
              || value === undefined
              || (startDate != null && value < startDate)
              || (endDate != null && value >= endDate)
              ) {
              passesFilters = false;
              break;
            }

          } else {
            if (Array.isArray(value)) {
              let match = false;
              for (const v of value) {
                if (column._filteredValues.includes(v)) {
                  match = true;
                  break;
                }
              }
              if (!match) {
                passesFilters = false;
                break;
              }
            } else {
              if (!column._filteredValues.includes(value)) {
                passesFilters = false;
                break;
              }
            }
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
