import {
  Column,
  ColumnActionType,
  ColumnFilterType,
  ColumnSortDirection,
  RowService,  
} from '@biosimulations/shared/ui';

import { TableSimulator } from './tableSimulator.interface';
import { SimulatorCurationStatus } from '@biosimulations/datamodel/common';
import { UtilsService } from '@biosimulations/shared/services';

export const columns: Column[] = [
  {
    id: 'id',
    heading: 'Id',
    key: 'id',
    filterable: false,
    show: false,
    minWidth: 110,
    showStacked: false,
  },
  {
    id: 'name',
    heading: 'Name',
    key: 'name',
    centerAction: ColumnActionType.routerLink,
    centerRouterLink: (element: TableSimulator): string[] => {
      return ['/simulators', element.id];
    },
    filterable: false,
    minWidth: 130,
    showStacked: false,
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
      return name.substring(0, 1).toUpperCase() + name.substring(1);
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
    minWidth: 165,
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
    toolTipFormatter: (names: string[]): string => {
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
    showFilterItemToolTips: true,
    extraSearchGetter: (element: TableSimulator):string => {
      return element.algorithmIds.join(' ');
    },
    minWidth: 165,
  },
  {
    id: 'modelFormats',
    heading: 'Model formats',
    key: 'modelFormats',
    getter: (element: TableSimulator): string[] => {
      const value = [];
      for (const format of element.modelFormats) {
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
      return element.modelFormatIds.join(' ');
    },
    minWidth: 132,
  },
  {
    id: 'simulationFormats',
    heading: 'Simulation formats',
    key: 'simulationFormats',
    getter: (element: TableSimulator): string[] => {
      const value = [];
      for (const format of element.simulationFormats) {
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
      return element.simulationFormatIds.join(' ');
    },
    minWidth: 142,
    show: false,
  },
  {
    id: 'archiveFormats',
    heading: 'Archive formats',
    key: 'archiveFormats',
    getter: (element: TableSimulator): string[] => {
      const value = [];
      for (const format of element.archiveFormats) {
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
      return element.archiveFormatIds.join(' ');
    },
    minWidth: 142,
    show: false,
  },
  {
    id: 'image',
    heading: 'Image',
    key: 'image',
    formatter: (): null => {
      return null;
    },
    stackedFormatter: (value: string | undefined): string => {
      return value ? value : 'Not available';
    },
    filterGetter: (element: TableSimulator): boolean => {
      return !!element.image;
    },
    filterFormatter: (value: string | undefined): string => {
      return value ? 'Yes' : 'No';
    },
    centerAction: ColumnActionType.href,
    rightAction: ColumnActionType.href,
    centerHref: (element: TableSimulator): string | null => {
      if (element.image) {
        return 'https://github.com/orgs/biosimulators/packages/container/package/' + element.id;
      } else {
        return null;
      }
    },
    rightHref: (element: TableSimulator): string | null => {
      if (element.image) {
        return 'https://github.com/orgs/biosimulators/packages/container/package/' + element.id;
      } else {
        return null;
      }
    },
    rightIcon: 'docker',
    rightIconTitle: (element: TableSimulator): string | null => {
      if (element.image) {
        return 'BioSimulators-compliant Docker image';
      } else {
        return null;
      }
    },
    filterable: true,
    filterSortDirection: ColumnSortDirection.desc,
    show: false,
    minWidth: 60,
    maxWidth: 60,
    center: true,
    rightShowStacked: false,
  },
  {
    id: 'interfaceTypes',
    heading: 'Interfaces',
    key: 'interfaceTypes',
    formatter: (value: string[] | string): string => {
      if (Array.isArray(value)) {
        return value.join(', ');
      } else {
        return value;
      }
    },
    filterFormatter: (value: string): string => {
      return value.substring(0, 1).toUpperCase() + value.substring(1);
    },
    filterable: true,
    showFilterItemToolTips: false,
    show: false,
    minWidth: 180,
  },
  {
    id: 'supportedOperatingSystemTypes',
    heading: 'OSes',
    key: 'supportedOperatingSystemTypes',
    formatter: (value: string[] | string): string => {
      if (Array.isArray(value)) {
        return value.join(', ');
      } else {
        return value;
      }
    },
    filterable: true,
    showFilterItemToolTips: false,
    show: false,
    minWidth: 92,
  },
  {
    id: 'supportedProgrammingLanguages',
    heading: 'Languages',
    key: 'supportedProgrammingLanguages',
    formatter: (value: string[] | string): string => {
      if (Array.isArray(value)) {
        return value.join(', ');
      } else {
        return value;
      }
    },
    filterable: true,
    showFilterItemToolTips: false,
    show: false,
    minWidth: 92,
  },
  {
    id: 'curationStatus',
    heading: 'Curation',
    key: 'curationStatus',
    formatter: (value: SimulatorCurationStatus): string => UtilsService.getSimulatorCurationStatusMessage(value, false),
    toolTipFormatter: (value: SimulatorCurationStatus): string => UtilsService.getSimulatorCurationStatusMessage(value),
    stackedFormatter: (value: SimulatorCurationStatus): string => UtilsService.getSimulatorCurationStatusMessage(value),
    filterFormatter: (value: SimulatorCurationStatus): string => UtilsService.getSimulatorCurationStatusMessage(value),
    filterable: true,
    filterValues: Object.values(SimulatorCurationStatus).filter((value: number | string): boolean => typeof value === "number"),
    filterSortDirection: ColumnSortDirection.desc,
    showFilterItemToolTips: true,
    show: true,
    minWidth: 92,
    maxWidth: 92,
    center: true,
  },
  {
    id: 'license',
    heading: 'License',
    key: 'license',
    toolTipFormatter: (value: string | null): string | null => {
      return value;
    },
    extraSearchGetter: (element: TableSimulator): string | null => {
      return element.licenseId ? element.licenseId : null;
    },
    show: false,
    minWidth: 125,
    showFilterItemToolTips: true,
  },
  {
    id: 'updated',
    heading: 'Updated',
    key: 'updated',
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
    getter: (element: TableSimulator): string | null => {
      if (element.image && element.curationStatus === SimulatorCurationStatus['Image validated']) {
        return element.id;
      } else {
        return null;
      }
    },
    formatter: (): null => {
      return null;
    },
    stackedFormatter: (id: string | undefined): string => {
      if (id) {
        return 'https://run.biosimulations.org/run?simulator=' + id;
      } else {
        return 'Not available';
      }
    },
    rightIcon: 'simulator',
    rightIconTitle: (element: TableSimulator): string | null => {
      if (element.image && element.curationStatus === SimulatorCurationStatus['Image validated']) {
        return 'Execute simulations with ' + element.name + ' @ runBioSimulations';
      } else {
        return null;
      }
    },
    centerAction: ColumnActionType.href,
    rightAction: ColumnActionType.href,
    centerHref: (element: TableSimulator): string | null => {
      if (element.image && element.curationStatus === SimulatorCurationStatus['Image validated']) {
        return 'https://run.biosimulations.org/run?simulator=' + element.id;
      } else {
        return null;
      }
    },
    rightHref: (element: TableSimulator): string | null  => {
      if (element.image && element.curationStatus === SimulatorCurationStatus['Image validated']) {
        return 'https://run.biosimulations.org/run?simulator=' + element.id;
      } else {
        return null;
      }
    },
    rightShowStacked: false,
    minWidth: 40,
    maxWidth: 40,
    center: true,
    filterable: false,
    sortable: false,
  },
  {
    id: 'moreInfo',
    heading: 'Docs',
    key: 'url',
    formatter: (): null => {
      return null;
    },
    stackedFormatter: (url: string | null): string => {
      return url || '';
    },
    rightIcon: 'tutorial',
    rightIconTitle: (element: TableSimulator): string => {
      return element.name + ' website';
    },
    centerAction: ColumnActionType.href,
    rightAction: ColumnActionType.href,
    centerHref: (element: TableSimulator): string | null => {
      return element.url;
    },
    rightHref: (element: TableSimulator): string | null => {
      return element.url;
    },
    rightShowStacked: false,
    minWidth: 40,
    maxWidth: 40,
    center: true,
    filterable: false,
    sortable: false,
  },
];
