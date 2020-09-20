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
  center = 'center',
  right = 'right',
}

export interface Column {
  id: string;
  heading: string;
  key?: string | string[];
  getter?: (rowData: any) => any;
  filterGetter?: (rowData: any) => any;
  passesFilter?: (rowData: any, filterValues: any[]) => boolean;
  formatter?: (cellValue: any) => any;
  stackedFormatter?: (cellValue: any) => any;
  filterFormatter?: (cellValue: any) => any;
  leftIcon?: string;
  rightIcon?: string;
  leftIconTitle?: (rowData: any) => string | null;
  rightIconTitle?: (rowData: any) => string | null;
  leftLinkType?: ColumnLinkType;
  centerLinkType?: ColumnLinkType;
  rightLinkType?: ColumnLinkType;
  leftRouterLink?: (rowData: any) => any[] | null;
  centerRouterLink?: (rowData: any) => any[] | null;
  rightRouterLink?: (rowData: any) => any[] | null;
  leftHref?: (rowData: any) => string | null;
  centerHref?: (rowData: any) => string | null;
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
  showStacked?: boolean;
  _index?: number;
}

export interface Sort {
  active: string;
  direction: string;
}

export class RowService {  
  static getElementRouterLink(element: any, column: Column, side: Side): any {
    if (
      side == Side.left &&
      column.leftLinkType === ColumnLinkType.routerLink &&
      column.leftRouterLink !== undefined
    ) {
      return column.leftRouterLink(element);
    } else if (
      side == Side.center &&
      column.centerLinkType === ColumnLinkType.routerLink &&
      column.centerRouterLink !== undefined
    ) {
      return column.centerRouterLink(element);
    } else if (
      side == Side.right &&
      column.rightLinkType === ColumnLinkType.routerLink &&
      column.rightRouterLink !== undefined
    ) {
      return column.rightRouterLink(element);
    } else {
      return null;
    }
  }

  static getElementHref(element: any, column: Column, side: Side): any {
    if (
      side == Side.left &&
      column.leftLinkType === ColumnLinkType.href &&
      column.leftHref !== undefined
    ) {
      return column.leftHref(element);
    } else if (
      side == Side.center &&
      column.centerLinkType === ColumnLinkType.href &&
      column.centerHref !== undefined
    ) {
      return column.centerHref(element);
    } else if (
      side == Side.right &&
      column.rightLinkType === ColumnLinkType.href &&
      column.rightHref !== undefined
    ) {
      return column.rightHref(element);
    } else {
      return null;
    }
  }

  static getElementValue(
    element: any,
    column: Column | undefined,
    defaultKey?: string | undefined
  ): any {
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

  static getIconTitle(element: any, column: Column, side: Side): string | null {
    if (side == Side.left && column.leftIconTitle !== undefined) {
      return column.leftIconTitle(element);
    } else if (side == Side.right && column.rightIconTitle !== undefined) {
      return column.rightIconTitle(element);
    } else {
      return column.heading;
    }
  }

  static getElementFilterValue(
    element: any,
    column: Column | undefined,
    defaultKey?: string | undefined
  ): any {
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

  static getComparator(column: Column | undefined, useDefault = false): any {
    if (useDefault || column === undefined) {
      return RowService.comparator;
    } else if (column.comparator !== undefined) {
      return column.comparator;
    } else {
      return RowService.comparator;
    }
  }

  static getFilterComparator(column: Column | undefined, useDefault = false): any {
    if (useDefault || column === undefined) {
      return RowService.comparator;
    } else if (column.filterComparator !== undefined) {
      return column.filterComparator;
    } else if (column.comparator !== undefined) {
      return column.comparator;
    } else {
      return RowService.comparator;
    }
  }

  static comparator(a: any, b: any, sign = 1): number {
    if (a == null) {
      if (b == null) {
        return 0;
      } else {
        return 1 * sign;
      }
    } else if (b == null) {
      return -1 * sign;
    }

    if (typeof a === 'string') {
      return a.localeCompare(b, undefined, { numeric: true });
    }

    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }

  static formatElementValue(value: any, column: Column, stacked = false): any {
    if (stacked && column.stackedFormatter !== undefined) {
      return column.stackedFormatter(value);
    } else if (column.formatter !== undefined) {
      return column.formatter(value);
    } else {
      return value;
    }
  }

  static formatElementFilterValue(value: any, column: Column): any {
    if (column.filterFormatter !== undefined) {
      return column.filterFormatter(value);
    } else if (column.formatter !== undefined) {
      return column.formatter(value);
    } else {
      return value;
    }
  }
}
