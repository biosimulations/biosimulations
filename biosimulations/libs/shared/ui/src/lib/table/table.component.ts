import { Component, OnInit, AfterViewInit, Input, ViewChild, Injectable } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BehaviorSubject, Observable } from 'rxjs';

export enum ColumnLinkType {
  routerLink = 'routerLink',
  href = 'href',
}

export enum ColumnFilterType {
  string = 'string',
  number = 'number',
  date = 'date',
}

export enum Side {
  left = 'left',
  right = 'right'
}

export interface Column {
  id: string;
  heading: string;
  key?: string | string[];
  getter?: (rowData: any) => any;
  filterGetter?: (rowData: any) => any;
  passesFilter?: (rowData: any, filterValues: any[]) => boolean;
  formatter?: (cellValue: any) => any;
  filterFormatter?: (cellValue: any) => any;
  leftIcon?: string;
  rightIcon?: string;
  leftIconTitle?: (rowData: any) => string | null;
  rightIconTitle?: (rowData: any) => string | null;
  leftLinkType?: ColumnLinkType;
  rightLinkType?: ColumnLinkType;
  leftRouterLink?: (rowData: any) => any[] | null;
  rightRouterLink?: (rowData: any) => any[] | null;
  leftHref?: (rowData: any) => string | null;
  rightHref?: (rowData: any) => string | null;
  minWidth?: number;
  center?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  comparator?: (a: any, b: any, sign: number) => number;
  filterComparator?: (a: any, b: any, sign: number) => number;
  filterType?: ColumnFilterType;
  numericFilterStep?: number;
  show?: boolean;
  _index?: number;
}

@Injectable()
export class TableDataSource extends MatTableDataSource<any> {
  paginator!: MatPaginator;
  sort!: MatSort;
  isLoading = new BehaviorSubject(true);

  constructor() {
    super();

    this.data = [];
    this.isLoading.next(true);
  }

  isLoading$(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  refresh(): void {
  }
}

@Component({
  selector: 'biosimulations-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [TableDataSource],
})
export class TableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private _columns!: Column[];
  columnsToShow!: string[];
  idToColumn!: { [id: string] : Column };
  isLoading!: Observable<boolean>;
  filter: {[id: string]: any[]} = {};
  defaultSort?: {active: string, direction: string};

  @Input()
  linesPerRow = 1;

  @Input()
  set columns(columns: Column[]) {
    columns.forEach((column: Column, iColumn: number): void => {
      column._index = iColumn;
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

  setData(data: any[]): void {
    const sortedData = this.sortData(data, this.defaultSort)
    sortedData.forEach((datum: any, iDatum: number): void => {datum._index = iDatum});
    this.dataSource.data = sortedData;
    this.dataSource.isLoading.next(false);
  }

  constructor(public dataSource: TableDataSource) {}

  ngOnInit(): void {
    this.isLoading = this.dataSource.isLoading$();
  }

  ngAfterViewInit(): void {
    this.filter = {};
    this.dataSource.filter = JSON.stringify(this.filter);
    this.dataSource.filterPredicate = this.filterData.bind(this);
    this.dataSource.sort = this.sort;
    this.dataSource.sortData = this.sortData.bind(this);
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  getElementRouterLink(element: any, column: Column, side: Side): any {
    if (side == Side.left && column.leftLinkType === ColumnLinkType.routerLink && column.leftRouterLink !== undefined) {
      return column.leftRouterLink(element);
    } else if (side == Side.right && column.rightLinkType === ColumnLinkType.routerLink && column.rightRouterLink !== undefined) {
      return column.rightRouterLink(element);
    } else {
      return null;
    }
  }

  getElementHref(element: any, column: Column, side: Side): any {
    if (side == Side.left && column.leftLinkType === ColumnLinkType.href && column.leftHref !== undefined) {
      return column.leftHref(element);
    } else if (side == Side.right && column.rightLinkType === ColumnLinkType.href && column.rightHref !== undefined) {
      return column.rightHref(element);
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

  getIconTitle(element: any, column: Column, side: Side): string | null {
    if (side == Side.left && column.leftIconTitle !== undefined) {
      return column.leftIconTitle(element);
    } else if (side == Side.right && column.rightIconTitle !== undefined) {
      return column.rightIconTitle(element);
    } else {
      return column.heading;
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
    for (const datum of this.dataSource.data) {
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
      return comparator(a.value, b.value);
    });
    return arrValues.map((el: any): any => {return el.value});
  }

  getNumericColumnRange(column: Column): any {
    if (this.dataSource.data.length === 0) {
      return {min: null, max: null, step: null};
    }

    const range: any = {
      min: null,
      max: null,
      step: null,
    }

    for (const datum of this.dataSource.data) {
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

  filterSetValue(column: Column, value: any, show: boolean): void {
    if (show) {
      if (!(column.id in this.filter)) {
        this.filter[column.id] = [];
      }
      this.filter[column.id].push(value);
    } else {
      this.filter[column.id].splice(this.filter[column.id].indexOf(value), 1);
      if (this.filter[column.id].length === 0) {
        delete this.filter[column.id];
      }
    }

    this.dataSource.filter = JSON.stringify(this.filter);
  }

  filterNumberValue(column: Column, fullRange: any, selectedRange: number[]): void {
    if (fullRange.min === selectedRange[0] && fullRange.max === selectedRange[1]) {
      if (column.id in this.filter) {
        delete this.filter[column.id];
      }
    } else {
      this.filter[column.id] = selectedRange;
    }

    this.dataSource.filter = JSON.stringify(this.filter);
  }

  filterStartDateValue(column: Column, event: MatDatepickerInputEvent<Date>): void {
    if (event.value == null) {
      if (column.id in this.filter) {
        if (this.filter[column.id][1] == null) {
          delete this.filter[column.id];
        } else {
          this.filter[column.id][0] = null;
        }
      }
    } else {
      if (column.id in this.filter) {
        this.filter[column.id][0] = event.value;
      } else {
        this.filter[column.id] = [event.value, null];
      }
    }

    this.dataSource.filter = JSON.stringify(this.filter);
  }

  filterEndDateValue(column: Column, event: MatDatepickerInputEvent<Date>): void {
    if (event.value == null) {
      if (column.id in this.filter) {
        if (this.filter[column.id][0] == null) {
          delete this.filter[column.id];
        } else {
          this.filter[column.id][1] = null;
        }
      }
    } else {
      if (column.id in this.filter) {
        this.filter[column.id][1] = event.value;
      } else {
        this.filter[column.id] = [null, event.value];
      }
    }

    this.dataSource.filter = JSON.stringify(this.filter);
  }

  filterData(datum: any, filter: string): boolean {
    for (const columnId in this.filter) {
      const column = this.idToColumn[columnId];

      let passesFilter;
      if (column.passesFilter === undefined) {
        passesFilter = this.passesColumnFilter.bind(this, column);
      } else {
        passesFilter = column.passesFilter;
      }

      const filterValue = this.filter[column.id];

      if (!passesFilter(datum, filterValue)) {
        return false;
      }
    }

    return true;
  }

  passesColumnFilter(column: Column, datum: any, filterValue: any[]): boolean {
    const value = this.getElementFilterValue(datum, column);

    if (column.filterType === ColumnFilterType.number) {
      if (value == null
        || value === undefined
        || (filterValue[0] != null && value < filterValue[0])
        || (filterValue[1] != null && value > filterValue[1])
        ) {
        return false;
      }

    } else if (column.filterType === ColumnFilterType.date) {
      const startDate = filterValue[0];
      const endDate = filterValue[1];
      if (endDate != null) {
        endDate.setDate(endDate.getDate() + 1);
      }

      if (value == null
        || value === undefined
        || (startDate != null && value < startDate)
        || (endDate != null && value >= endDate)
        ) {
        return false;
      }

    } else {
      if (Array.isArray(value)) {
        let match = false;
        for (const v of value) {
          if (filterValue.includes(v)) {
            match = true;
            break;
          }
        }
        if (!match) {
          return false;
        }
      } else {
        if (!filterValue.includes(value)) {
          return false;
        }
      }
    }

    return true;
  }

  sortData(data: any[], sort: any): any[] {
    if (sort === undefined) {
      return data;
    }

    const sortColumnId = sort.active;
    const sortDirection = sort.direction;

    const sortedData = [...data];

    sortedData.sort((a: any, b: any): number => {
      let defaultKey: string | undefined = undefined;
      let column: Column | undefined = undefined;
      if (sortDirection === '') {
        defaultKey = '_index';
      } else if (sortColumnId) {
        column = this.idToColumn[sortColumnId];
      }

      const aVal = this.getElementValue(a, column, defaultKey);
      const bVal = this.getElementValue(b, column, defaultKey);

      const sign = sortDirection !== "desc" ? 1 : -1;

      const comparator = this.getComparator(column, sortDirection === '');
      return sign * comparator(aVal, bVal, sign);
    });

    return sortedData;
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

  refresh(): void {
    this.dataSource.refresh();
  }
}
