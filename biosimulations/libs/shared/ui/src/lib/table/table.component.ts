import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
  Injectable,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Sort } from '@angular/material/sort';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Column, ColumnLinkType, ColumnFilterType, Side, RowService } from './table.interface';

// TODO fix datasource / loading functionality
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

  refresh(): void {}
}

@Component({
  selector: 'biosimulations-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  providers: [TableDataSource],
})
export class TableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild(MatPaginator) private paginator!: MatPaginator;
  @ViewChild(MatSort) private sort!: MatSort;

  private _columns!: Column[];
  columnsToShow!: string[];
  private idToColumn!: { [id: string]: Column };
  isLoading!: Observable<boolean>;
  private isLoaded!: Observable<boolean>;
  private filter: { [id: string]: any[] } = {};

  @Input()
  defaultSort!: { active: string; direction: string };

  @Input()
  linesPerRow = 1;

  @Input()
  set columns(columns: Column[]) {
    this._columns = columns;
    this.setColumnsToShow();

    columns.forEach((column: Column, iColumn: number): void => {
      column._index = iColumn;
    });

    this.idToColumn = columns.reduce(
      (map: { [id: string]: Column }, col: Column) => {
        map[col.id] = col;
        return map;
      },
      {}
    );
  }

  get columns(): Column[] {
    return this._columns;
  }

  @Input()
  singleLineHeadings = false;

  @Input()
  sortable = true;

  @Input()
  controls = true;

  private subscription?: Subscription;

  @Input()
  set data(data: Observable<any[]>) {
    this.subscription = data.subscribe((data: any) => {
      this.dataSource.isLoading.next(true);
      const sortedData = this.sortData(data, this.defaultSort);
      sortedData.forEach((datum: any, iDatum: number): void => {
        datum._index = iDatum;
      });

      sortedData.forEach((datum: any): void => {
        const cache: any = {};
        datum['_cache'] = cache;

        this.columns.forEach((column: Column): void => {
          cache[column.id] = {
            value: RowService.formatElementValue(RowService.getElementValue(datum, column), column),
            left: {},
            center: {},
            right: {},
          };

          if (column.leftLinkType === ColumnLinkType.routerLink) {
            cache[column.id].left['routerLink'] = RowService.getElementRouterLink(datum, column, Side.left);
          } else if (column.leftLinkType === ColumnLinkType.href) {
            cache[column.id].left['href'] = RowService.getElementHref(datum, column, Side.left);
          }
          cache[column.id].left['iconTitle'] = RowService.getIconTitle(datum, column, Side.left);

          if (column.centerLinkType === ColumnLinkType.routerLink) {
            cache[column.id].center['routerLink'] = RowService.getElementRouterLink(datum, column, Side.center);
          } else if (column.centerLinkType === ColumnLinkType.href) {
            cache[column.id].center['href'] = RowService.getElementHref(datum, column, Side.center);
          }
          // cache[column.id].center['iconTitle'] = RowService.getIconTitle(datum, column, Side.center);

          if (column.rightLinkType === ColumnLinkType.routerLink) {
            cache[column.id].right['routerLink'] = RowService.getElementRouterLink(datum, column, Side.right);
          } else if (column.rightLinkType === ColumnLinkType.href) {
            cache[column.id].right['href'] = RowService.getElementHref(datum, column, Side.right);
          }
          cache[column.id].right['iconTitle'] = RowService.getIconTitle(datum, column, Side.right);
        });
      });


      this.columns.forEach((column: Column): void => {
        switch (column.filterType) {
          case ColumnFilterType.number:
            column._filterData = this.getNumericColumnRange(sortedData, column);
            break;
          case ColumnFilterType.date:
            break;
          default:
            column._filterData = this.getTextColumnValues(sortedData, column);
            break;
        }
      });

      this.dataSource.data = sortedData;
      this.dataSource.isLoading.next(false);
    });
  }

  constructor(public dataSource: TableDataSource) {}

  ngOnInit(): void {
    this.isLoading = this.dataSource.isLoading$();
    this.isLoaded = this.dataSource
      .isLoading$()
      .pipe(map((isloaded: boolean) => !isloaded));
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.filter = {};
    this.setDataSourceFilter();
    this.dataSource.filterPredicate = this.filterData.bind(this);
    this.dataSource.sort = this.sort;
    this.dataSource.sortData = this.sortData.bind(this);
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  getTextColumnValues(data: any[], column: Column): any[] {
    const values: any = {};
    for (const datum of data) {
      const value: any = RowService.getElementFilterValue(datum, column);

      if (Array.isArray(value)) {
        for (const v of value) {
          const formattedV = RowService.formatElementFilterValue(v, column);
          if (formattedV != null && formattedV !== '') {
            values[v] = formattedV;
          }
        }
      } else {
        const formattedValue = RowService.formatElementFilterValue(value, column);
        if (formattedValue != null && formattedValue !== '') {
          values[value] = formattedValue;
        }
      }
    }

    const comparator = RowService.getFilterComparator(column);
    const arrValues = Object.keys(values).map((key: any): any => {
      return { value: key, formattedValue: values[key] };
    });
    arrValues.sort((a: any, b: any): number => {
      return comparator(a.value, b.value);
    });
    return arrValues;
  }

  getNumericColumnRange(data: any[], column: Column): any {
    if (data.length === 0) {
      return { min: null, max: null, step: null };
    }

    const range: any = {
      min: null,
      max: null,
      step: null,
    };

    for (const datum of this.dataSource.data) {
      const value = RowService.getElementFilterValue(datum, column);
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
      range.step = Math.pow(
        10,
        Math.floor(Math.log10((range.max - range.min) / 1000))
      );
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

    this.setDataSourceFilter();
  }

  filterNumberValue(
    column: Column,
    fullRange: any,
    selectedRange: number[]
  ): void {
    if (
      fullRange.min === selectedRange[0] &&
      fullRange.max === selectedRange[1]
    ) {
      if (column.id in this.filter) {
        delete this.filter[column.id];
      }
    } else {
      this.filter[column.id] = selectedRange;
    }

    this.setDataSourceFilter();
  }

  filterStartDateValue(
    column: Column,
    event: MatDatepickerInputEvent<Date>
  ): void {
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

    this.setDataSourceFilter();
  }

  filterEndDateValue(
    column: Column,
    event: MatDatepickerInputEvent<Date>
  ): void {
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

    this.setDataSourceFilter();
  }

  setDataSourceFilter(): void {
    if (Object.keys(this.filter).length) {
      // Hack: alternate between value of 'a' and 'b' to force data source to filter the data
      if (this.dataSource.filter === 'a') {
        this.dataSource.filter = 'b';
      } else {
        this.dataSource.filter = 'a';
      }
    } else {
      this.dataSource.filter = '';
    }
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
    const value = RowService.getElementFilterValue(datum, column);

    if (column.filterType === ColumnFilterType.number) {
      if (
        value == null ||
        value === undefined ||
        (filterValue[0] != null && value < filterValue[0]) ||
        (filterValue[1] != null && value > filterValue[1])
      ) {
        return false;
      }
    } else if (column.filterType === ColumnFilterType.date) {
      const startDate = filterValue[0];
      const endDate = filterValue[1];
      if (endDate != null) {
        endDate.setDate(endDate.getDate() + 1);
      }

      if (
        value == null ||
        value === undefined ||
        (startDate != null && value < startDate) ||
        (endDate != null && value >= endDate)
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

      const aVal = RowService.getElementValue(a, column, defaultKey);
      const bVal = RowService.getElementValue(b, column, defaultKey);

      const sign = sortDirection !== 'desc' ? 1 : -1;

      const comparator = RowService.getComparator(column, sortDirection === '');
      return sign * comparator(aVal, bVal, sign);
    });

    return sortedData;
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
