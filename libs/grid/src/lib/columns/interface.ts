import { ColumnFilterType, FilterDefinition } from '../filters';

export enum ColumnActionType {
  routerLink = 'routerLink',
  href = 'href',
  click = 'click',
}

export enum Side {
  left = 'left',
  center = 'center',
  right = 'right',
}
export type HrefDefinition = (rowData: any) => string | null;
export type ClickDefinition = (rowData: any) => ((rowData: any) => void) | null;
export type ComparatorDefinition = (a: any, b: any, sign: number) => number;
export type RouterLinkDefinition = (rowData: any) => any[] | null;
export type FormatterDefinition = (cellValue: any, rowData: any) => any;
export interface Column {
  id: string;
  heading: string;
  units?: string;
  key?: string | string[];
  getter?: (rowData: any) => any;
  filterGetter?: (rowData: any) => any;
  extraSearchGetter?: (rowData: any) => string | null;
  passesFilter?: (rowData: any, filterValues: any[]) => boolean;
  formatter?: (cellValue: any, rowData: any) => any;
  toolTipFormatter?: FormatterDefinition;
  stackedFormatter?: FormatterDefinition;
  filterFormatter?: FormatterDefinition;
  leftIcon?: string | ((rowData: any) => string | null);
  rightIcon?: string | ((rowData: any) => string | null);
  leftIconTitle?: (rowData: any) => string | null;
  rightIconTitle?: (rowData: any) => string | null;
  leftAction?: ColumnActionType;
  centerAction?: ColumnActionType;
  rightAction?: ColumnActionType;
  leftRouterLink?: RouterLinkDefinition;
  centerRouterLink?: RouterLinkDefinition;
  rightRouterLink?: RouterLinkDefinition;
  leftHref?: HrefDefinition;
  centerHref?: HrefDefinition;
  rightHref?: HrefDefinition;
  leftClick?: ClickDefinition;
  centerClick?: ClickDefinition;
  rightClick?: ClickDefinition;
  minWidth?: number;
  maxWidth?: number;
  center?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  comparator?: ComparatorDefinition;
  filterValues?: any[];
  filterDefinition?: FilterDefinition;
  filterComparator?: ComparatorDefinition;
  filterType?: ColumnFilterType;
  filterSortDirection?: ColumnSortDirection;
  showFilterItemToolTips?: boolean;
  numericFilterStep?: number;
  hidden?: boolean;
  show?: boolean;
  showStacked?: boolean;
  centerShowStacked?: boolean;
  rightShowStacked?: boolean;
  _index?: number;
  _filterData?: any;
  _visible?: boolean;
}

export interface IdColumnMap {
  [id: string]: Column;
}

export interface ColumnSort {
  active: string;
  direction?: ColumnSortDirectionType;
}

export enum ColumnSortDirection {
  asc = 'asc',
  desc = 'desc',
}
export type ColumnSortDirectionType = 'asc' | 'desc';
