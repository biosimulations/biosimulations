import { Component, Input, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

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
    columns.forEach((column: any): void => {
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
    data.forEach((datum: any, iDatum: number): void => {datum._index = iDatum});
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

  getElementValue(element: any, column: any, defaultKey?: string): any {
    if (column != null && 'getter' in column) {
      return column.getter(element);
    } else if (column != null && 'key' in column) {
      if (column.key in element) {
        return element[column.key];
      } else {
        return null;
      }
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

  getElementFilterValue(element: any, column: any, defaultKey?: string): any {
    if (column != null && 'filterGetter' in column) {
      return column.filterGetter(element);
    } else if (column != null && 'getter' in column) {
      return column.getter(element);
    } else if (column != null && 'key' in column) {
      if (column.key in element) {
        return element[column.key];
      } else {
        return null;
      }
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

  getComparator(column: any, useDefault = false): any {
    if (useDefault) {
      return TableComponent.comparator;
    } else if ('comparator' in column) {
      return column.comparator;
    } else {
      return TableComponent.comparator;
    }
  }

  getFilterComparator(column: any, useDefault = false): any {
    if (useDefault) {
      return TableComponent.comparator;
    } else if ('filterComparator' in column) {
      return column.filterComparator;
    } else if ('comparator' in column) {
      return column.comparator;
    } else {
      return TableComponent.comparator;
    }    
  }

  formatElementValue(value: any, column: any): any {
    if ('formatter' in column) {
      return column.formatter(value);
    } else {
      return value;
    }
  }

  formatElementFilterValue(value: any, column: any): any {
    if ('filterFormatter' in column) {
      return column.filterFormatter(value);
    } else if ('formatter' in column) {
      return column.formatter(value);
    } else {
      return value;
    }
  }

  getTextColumnValues(column: any): any[] {
    const values = new Set();
    for (const datum of this.data) {
      const value = this.getElementFilterValue(datum, column);      
    
      if (Array.isArray(value)) {
        for (const v of value) {
          const formattedV = this.formatElementFilterValue(v, column);
          if (formattedV != null && formattedV !== '') {
            values.add({value: v, formattedValue: formattedV});
          }
        }
      } else {
        const formattedValue = this.formatElementFilterValue(value, column);
        if (formattedValue != null && formattedValue !== '') {
          values.add({value: value, formattedValue: formattedValue});
        }
      }
    }

    const comparator = this.getFilterComparator(column);
    const arrValues = Array.from(values);
    arrValues.sort((a: any, b: any): number => {
      return comparator(a.formattedValue, b.formattedValue);
    });    
    return arrValues.map((el: any): any => {return el.value});
  }

  getNumericColumnRange(column: any): any {
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

    if ('numericFilterStep' in column) {
      range.step = column.numericFilterStep;
    } else if (range.max === range.min) {
      range.step = 0;
    } else {
      range.step = Math.pow(10, Math.floor(Math.log10((range.max - range.min) / 1000)));
    }

    return range;
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
    this.filteredData.sort((a: any, b: any): number => {
      let defaultKey;
      let column;
      if (this.sortDirection === '') {
        defaultKey = '_index';
      } else if (this.sortColumn) {
        column = this.idToColumn[this.sortColumn];
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

  toggleColumn(column: any): void {
    column.show = column.show === false;
    this.setColumnsToShow();
  }

  setColumnsToShow(): void {
    this.columnsToShow = this.columns
      .filter((col: any): any => col.show !== false)
      .map((col: any): string => col.id);
  }

  filterSetValue(column: any, value: any, show: boolean): void {
    if (show) {
      column._filteredValues.push(value);
    } else {
      column._filteredValues.splice(column._filteredValues.indexOf(value), 1);
    }

    this.filterSortData();
  }

  filterNumberValue(column: any, fullRange: any, selectedRange: number[]): void {
    if (fullRange.min === selectedRange[0] && fullRange.max === selectedRange[1]) {
      column._filteredValues = [];
    } else {
      column._filteredValues = selectedRange;
    }
    this.filterSortData();
  }

  filterStartDateValue(column: any, event: MatDatepickerInputEvent<Date>): void {
    if (event.value === null) {
      if (column._filteredValues.length > 0) {
        if (column._filteredValues[1] == null) {
          column._filteredValues = [];
        } else {
          column._filteredValues[0] = null;
        }
      }
    } else {
      if (column._filteredValues.length === 0) {
        column._filteredValues = [event.value, null];
      } else {
        column._filteredValues[0] = event.value;
      }
    }
    this.filterSortData();
  }

  filterEndDateValue(column: any, event: MatDatepickerInputEvent<Date>): void {
    if (event.value === null) {
      if (column._filteredValues.length > 0) {
        if (column._filteredValues[0] == null) {
          column._filteredValues = [];
        } else {
          column._filteredValues[1] = null;
        }
      }
    } else {      
      if (column._filteredValues.length === 0) {
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
        if (column.filterable !== false && column._filteredValues.length > 0) {
          const value = this.getElementFilterValue(datum, column);          

          if (column.filterType === 'date') {
            if (value == null
              || value === undefined
              || (column._filteredValues[0] != null && value < column._filteredValues[0])
              || (column._filteredValues[1] != null && value > column._filteredValues[1])
              ) {
              passesFilters = false;
              break;
            }

          } else if (column.filterType === 'date') {
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
