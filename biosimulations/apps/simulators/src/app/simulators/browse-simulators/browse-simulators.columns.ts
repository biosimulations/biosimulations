import {  
  Column,
  ColumnActionType,
  ColumnFilterType,
  RowService,
} from '@biosimulations/shared/ui';

import { TableSimulator } from './tableSimulator.interface';

export const columns: Column[] = [
  {
    id: 'id',
    heading: 'Id',
    key: 'id',
    centerAction: ColumnActionType.routerLink,    
    centerRouterLink: (element: any): string[] => {
      return ['/simulators', element.id];
    },    
    filterable: false,
    minWidth: 90,
    showStacked: false,
  },
  {
    id: 'name',
    heading: 'Name',
    key: 'name',
    filterable: false,
    minWidth: 90,
    showStacked: false,
  },
  {
    id: 'frameworks',
    heading: 'Frameworks',
    key: 'frameworks',
    getter: (element: TableSimulator): string[] => {
      const value = [];
      for (const framework of element.frameworks) {
        value.push(framework);
      }
      value.sort((a: string, b: string): number => {
        return a.localeCompare(b, undefined, { numeric: true });
      });
      return value;
    },
    formatter: (names: string[]): string => {
      return names.join(', ');
    },
    filterFormatter: (name: string): string => {
      return name;
    },
    comparator: (aNames: string[], bNames: string[], sign = 1): number => {
      return RowService.comparator(
        aNames.join(', '),
        bNames.join(', '),
        sign
      );
    },
    filterComparator: (aName: string, bName: string, sign = 1): number => {
      return RowService.comparator(aName, bName, sign);
    },
    minWidth: 200,
  },
  {
    id: 'algorithms',
    heading: 'Algorithms',
    key: 'algorithms',
    getter: (element: TableSimulator): string[] => {
      const value = [];
      for (const algorithm of element.algorithms) {
        value.push(algorithm);
      }
      value.sort((a: string, b: string): number => {
        return a.localeCompare(b, undefined, { numeric: true });
      });
      return value;
    },
    formatter: (names: string[]): string => {
      return names.join(', ');
    },
    filterFormatter: (name: string): string => {
      return name;
    },
    comparator: (aNames: string[], bNames: string[], sign = 1): number => {
      return RowService.comparator(
        aNames.join(', '),
        bNames.join(', '),
        sign
      );
    },
    passesFilter: (
      element: TableSimulator,
      filterValues: string[]
    ): boolean => {
      const algorithms = element.algorithms;
      const algorithmSynonyms = element.algorithmSynonyms;
      for (const v of filterValues) {
        if (algorithms.includes(v)) {
          return true;
        }
        if (algorithmSynonyms.includes(v)) {
          return true;
        }
      }

      return false;
    },
    filterComparator: RowService.comparator,
    minWidth: 280,
  },
  {
    id: 'formats',
    heading: 'Model formats',
    key: 'formats',
    getter: (element: TableSimulator): string[] => {
      const value = [];
      for (const format of element.formats) {
        value.push(format);
      }
      value.sort((a: string, b: string): number => {
        return a.localeCompare(b, undefined, { numeric: true });
      });
      return value;
    },
    formatter: (names: string[]): string => {
      return names.join(', ');
    },
    filterFormatter: (name: string): string => {
      return name;
    },
    comparator: (aNames: string[], bNames: string[], sign = 1): number => {
      return RowService.comparator(
        aNames.join(', '),
        bNames.join(', '),
        sign
      );
    },
    filterComparator: RowService.comparator,
    minWidth: 114,
  },
  {
    id: 'latestVersion',
    heading: 'Latest version',
    key: 'latestVersion',
    filterable: false,
    show: false,
    minWidth: 110,
  },
  {
    id: 'license',
    heading: 'License',
    key: 'license',
    show: false,
    minWidth: 75,
  },
  {
    id: 'created',
    heading: 'Created',
    key: 'created',
    formatter: (value: Date): string => {
      return (
        value.getFullYear().toString() +
        '-' +
        (value.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        value.getDate().toString().padStart(2, '0')
      );
    },
    filterType: ColumnFilterType.date,
    show: false,
  },
  {
    id: 'moreInfo',
    heading: 'More info',
    key: 'url',
    formatter: (url: string): null => {
      return null;
    },
    stackedFormatter: (url: string): string => {
      return url;
    },
    rightIcon: 'link',
    rightIconTitle: (element: TableSimulator): string => {
      return element.name + ' website';
    },
    centerAction: ColumnActionType.href,
    rightAction: ColumnActionType.href,
    centerHref: (element: TableSimulator): string => {
      return element.url;
    },
    rightHref: (element: TableSimulator): string => {
      return element.url;
    },
    rightShowStacked: false,
    minWidth: 66,
    center: true,
    filterable: false,
    sortable: false,
  },
];
