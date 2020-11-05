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
    extraSearchGetter: (element: TableSimulator): string => {
      return element.frameworkIds.join(' ');
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
      for (const v of filterValues) {
        if (algorithms.includes(v)) {
          return true;
        }
      }

      return false;
    },
    filterComparator: RowService.comparator,
    extraSearchGetter: (element: TableSimulator):string => {
      return element.algorithmIds.join(' ');
    },
    minWidth: 244,
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
    extraSearchGetter: (element: TableSimulator): string => {
      return element.formatIds.join(' ');
    },
    minWidth: 132,
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
    extraSearchGetter: (element: TableSimulator): string => {
      return element.licenseId;
    },
    show: false,
    minWidth: 125,
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
    id: 'run',
    heading: 'Run',
    key: 'id',
    formatter: (url: string): null => {
      return null;
    },
    stackedFormatter: (url: string): string => {
      return url;
    },
    rightIcon: 'simulator',
    rightIconTitle: (element: TableSimulator): string => {
      return 'Execute simulations with ' + element.name + ' @ runBioSimulations';
    },
    centerAction: ColumnActionType.href,
    rightAction: ColumnActionType.href,
    centerHref: (element: TableSimulator): string => {
      return 'https://run.biosimulations.org/run/?simulator=' + element.id + '&simulatorVersion=' + element.latestVersion;
    },
    rightHref: (element: TableSimulator): string => {
      return 'https://run.biosimulations.org/run/?simulator=' + element.id + '&simulatorVersion=' + element.latestVersion;
    },
    rightShowStacked: false,
    minWidth: 40,
    center: true,
    filterable: false,
    sortable: false,
  },
  {
    id: 'moreInfo',
    heading: 'Docs',
    key: 'url',
    formatter: (url: string): null => {
      return null;
    },
    stackedFormatter: (url: string): string => {
      return url;
    },
    rightIcon: 'tutorial',
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
    minWidth: 40,
    center: true,
    filterable: false,
    sortable: false,
  },
];
