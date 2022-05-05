import { DataSource } from '@angular/cdk/collections';
import { Injectable } from '@angular/core';
import {
  LabeledIdentifier,
  DescribedIdentifier,
} from '@biosimulations/datamodel/common';
import {
  Column,
  FilterState,
  ColumnFilterType,
  IdColumnMap,
  ColumnSortDirection,
  StringFilterDefinition,
  NumberFilterDefinition,
  DateFilterDefinition,
  ColumnSort,
  Side,
  ColumnActionType,
} from '@biosimulations/grid';
import { FormatService } from '@biosimulations/shared/services';
import { RowService } from '@biosimulations/shared/ui';

import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { FormattedProjectSummary, LocationPredecessor } from '../browse.model';
import { BrowseService } from '../browse.service';

// TODO make this a instance of abstract class ColumnDataSource
@Injectable({
  providedIn: 'root',
})
export class BrowseDataSource extends DataSource<FormattedProjectSummary> {
  // TODO make this an input
  private initcolumns: Column[] = [
    {
      id: 'id',
      key: 'id',
      heading: 'Id',
      leftIcon: 'id',
      filterable: false,
      hidden: true,
      show: false,
    },
    {
      id: 'title',
      key: 'title',
      heading: 'Title',
      leftIcon: 'file',
      filterable: false,
      hidden: true,
      show: false,
    },
    {
      id: 'abstract',
      key: ['metadata', 'abstract'],
      heading: 'Abstract',
      leftIcon: 'file',
      filterable: false,
      hidden: false,
      show: true,
    },
    {
      id: 'description',
      key: ['metadata', 'description'],
      heading: 'Description',
      leftIcon: 'file',
      filterable: false,
      hidden: false,
      show: false,
    },
    {
      id: 'biology',
      key: ['metadata', 'encodes'],
      heading: 'Biology',
      leftIcon: 'cell',
      filterable: true,
      hidden: false,
      show: true,
      getter: (project: FormattedProjectSummary): string[] => {
        return project.metadata.encodes.map(
          (v: LabeledIdentifier) => v.label || v.uri,
        ) as string[];
      },
      extraSearchGetter: (project: FormattedProjectSummary): string => {
        return project.metadata.encodes
          .map((v: LabeledIdentifier) => {
            if (!v.label && v.uri) {
              return this.processUriForSearch(v.uri);
            } else {
              return '';
            }
          })
          .join(' ');
      },
    },
    {
      id: 'taxa',
      key: ['metadata', 'taxa'],
      heading: 'Taxa',
      leftIcon: 'taxon',
      filterable: true,

      hidden: false,
      show: true,
      getter: (project: FormattedProjectSummary): string[] => {
        return project.metadata.taxa.map(
          (v: LabeledIdentifier) => v.label || v.uri,
        ) as string[];
      },
      extraSearchGetter: (project: FormattedProjectSummary): string => {
        return project.metadata.taxa
          .map((v: LabeledIdentifier) => {
            if (!v.label && v.uri) {
              return this.processUriForSearch(v.uri);
            } else {
              return '';
            }
          })
          .join(' ');
      },
    },
    {
      id: 'keywords',
      key: ['metadata', 'keywords'],
      heading: 'Keywords',
      leftIcon: 'tag',
      filterable: true,

      hidden: false,
      show: false,
      getter: (project: FormattedProjectSummary): string[] => {
        return project.metadata.keywords.map(
          (v: LabeledIdentifier) => v.label,
        ) as string[];
      },
    },
    {
      id: 'citations',
      key: ['metadata', 'citations'],
      heading: 'Citations',
      leftIcon: 'journal',
      filterable: true,
      hidden: false,
      show: false,
      getter: (project: FormattedProjectSummary): string[] => {
        return project.metadata.citations.map(
          (v: LabeledIdentifier) => v.label || v.uri,
        ) as string[];
      },
      filterGetter: (project: FormattedProjectSummary): string => {
        return project.metadata.citations.length > 0 ? 'Yes' : 'No';
      },
      extraSearchGetter: (project: FormattedProjectSummary): string => {
        return project.metadata.citations
          .map((v: LabeledIdentifier) => {
            if (!v.label && v.uri) {
              return this.processUriForSearch(v.uri);
            } else {
              return '';
            }
          })
          .join(' ');
      },
    },
    {
      id: 'identifiers',
      key: ['metadata', 'identifiers'],
      heading: 'Identifiers',
      leftIcon: 'id',
      filterable: false,
      hidden: false,
      show: false,
      getter: (project: FormattedProjectSummary): string[] => {
        return project.metadata.identifiers.map(
          (v: LabeledIdentifier) => v.label || v.uri,
        ) as string[];
      },
      extraSearchGetter: (project: FormattedProjectSummary): string => {
        return project.metadata.identifiers
          .map((v: LabeledIdentifier) => {
            if (!v.label && v.uri) {
              return this.processUriForSearch(v.uri);
            } else {
              return '';
            }
          })
          .join(' ');
      },
    },
    {
      id: 'other',
      key: ['metadata', 'other'],
      heading: 'Additional metadata',
      leftIcon: 'info',
      filterable: false,
      hidden: false,
      show: false,
      getter: (project: FormattedProjectSummary): string[] => {
        return project.metadata.other.map((v: DescribedIdentifier) => {
          return (
            (v.attribute_label || v.attribute_uri || '') +
            ': ' +
            (v.label || v.uri || '')
          );
        }) as string[];
      },
      extraSearchGetter: (project: FormattedProjectSummary): string => {
        return project.metadata.other
          .map((v: DescribedIdentifier) => {
            let val = '';
            if (!v.attribute_label && v.attribute_uri) {
              val += this.processUriForSearch(v.attribute_uri);
            }
            if (!v.label && v.uri) {
              val += this.processUriForSearch(v.uri);
            }
            return val;
          })
          .join(' ');
      },
    },
    // sources
    // predecessors
    // successors
    // seeAlso
    // references
    {
      id: 'modelFormats',
      key: 'tasks',
      heading: 'Model formats',
      leftIcon: 'format',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): string[] => {
        return Array.from(
          new Set(
            project.tasks.map((task): string => {
              return (
                task.model.language.acronym ||
                task.model.language.name ||
                task.model.language.sedmlUrn
              );
            }),
          ),
        ).sort();
      },
      extraSearchGetter: (project: FormattedProjectSummary): string => {
        const vals = new Set<string>();
        project.tasks.forEach((task): void => {
          if (task.model.language.acronym && task.model.language.name) {
            vals.add(task.model.language.name);
          }
          if (task.model.language.edamId) {
            vals.add(task.model.language.edamId);
          }
          vals.add(task.model.language.sedmlUrn);
        });
        return Array.from(vals).join(' ');
      },
    },
    {
      id: 'simulationTypes',
      key: 'tasks',
      heading: 'Simulation types',
      leftIcon: 'framework',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): string[] => {
        return Array.from(
          new Set(
            project.tasks.map((task): string => {
              const sedmlLength = 'SED-ML'.length;
              return (
                task.simulation.type.name
                  .substring(sedmlLength + 1, sedmlLength + 2)
                  .toUpperCase() +
                task.simulation.type.name.substring(
                  sedmlLength + 2,
                  task.simulation.type.name.length - ' simulation'.length,
                )
              );
            }),
          ),
        ).sort();
      },
    },
    {
      id: 'simulationAlgorithms',
      key: 'tasks',
      heading: 'Simulation algorithms',
      leftIcon: 'framework',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): string[] => {
        return Array.from(
          new Set(
            project.tasks.map((task): string => {
              return (
                task.simulation.algorithm.name ||
                task.simulation.algorithm.kisaoId
              );
            }),
          ),
        ).sort();
      },
      extraSearchGetter: (project: FormattedProjectSummary): string => {
        return Array.from(
          new Set(
            project.tasks.map((task): string => {
              return task.simulation.algorithm.kisaoId;
            }),
          ),
        ).join(' ');
      },
    },
    {
      id: 'simulator',
      key: ['simulationRun', 'simulatorName'],
      heading: 'Simulation tools',
      leftIcon: 'simulator',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): string => {
        return (
          project.simulationRun.simulatorName +
          ' ' +
          project.simulationRun.simulatorVersion
        );
      },
      extraSearchGetter: (project: FormattedProjectSummary): string => {
        return project.simulationRun.simulator;
      },
    },
    {
      id: 'reports',
      key: 'outputs',
      heading: 'Reports',
      leftIcon: 'report',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): string => {
        for (const output of project.outputs) {
          if (output.type.id === 'SedReport') {
            return 'Yes';
          }
        }
        return 'No';
      },
    },
    {
      id: 'visualizations',
      key: 'outputs',
      heading: 'Visualizations',
      leftIcon: 'chart',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): string[] => {
        return Array.from(
          new Set(
            project.outputs
              .filter((output): boolean => {
                return output.type.id !== 'SedReport';
              })
              .map((output): string => {
                return output.type.name;
              }),
          ),
        ).sort();
      },
    },
    {
      id: 'projectSize',
      key: ['simulationRun', 'projectSize'],
      heading: 'Project size',
      leftIcon: 'disk',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): number => {
        return project.simulationRun.projectSize / 1e6;
      },
      formatter: (value: number): string => {
        return FormatService.formatDigitalSize(value * 1e6);
      },
      filterType: ColumnFilterType.number,
      units: 'MB',
    },
    {
      id: 'cpus',
      key: ['simulationRun', 'cpus'],
      heading: 'CPUs',
      leftIcon: 'processor',
      hidden: false,
      show: false,
      filterable: true,
      filterType: ColumnFilterType.number,
    },
    {
      id: 'memory',
      key: ['simulationRun', 'memory'],
      heading: 'Memory',
      leftIcon: 'memory',
      hidden: false,
      show: false,
      filterable: true,
      formatter: (value: number): string => {
        return FormatService.formatDigitalSize(value);
      },
      filterType: ColumnFilterType.number,
      units: 'GB',
    },
    {
      id: 'resultsSize',
      key: ['simulationRun', 'resultsSize'],
      heading: 'Results size',
      leftIcon: 'disk',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): number => {
        return project.simulationRun.resultsSize / 1e6;
      },
      formatter: (value: number): string => {
        return FormatService.formatDigitalSize(value * 1e6);
      },
      filterType: ColumnFilterType.number,
      units: 'MB',
    },
    {
      id: 'runtime',
      key: ['simulationRun', 'runtime'],
      heading: 'Runtime',
      leftIcon: 'duration',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): number => {
        return project.simulationRun.runtime / 60;
      },
      formatter: (value: number): string => {
        return FormatService.formatDuration(value * 60);
      },
      filterType: ColumnFilterType.number,
      units: 'min',
    },
    {
      id: 'simulationProvenance',
      key: ['metadata', 'locationPredecessors'],
      heading: 'Simulation provenance',
      leftIcon: 'backward',
      hidden: false,
      show: false,
      filterable: true,
      getter: (project: FormattedProjectSummary): string[] => {
        const value = new Set(
          project.metadata.locationPredecessors
            .filter((locationPredecessor: LocationPredecessor): boolean => {
              return locationPredecessor.location.endsWith('.sedml');
            })
            .map((predecessor: LocationPredecessor): string => {
              return predecessor.predecessor.uri?.startsWith(
                'http://omex-library.org/',
              ) && predecessor.predecessor.uri.indexOf('.omex/') !== -1
                ? 'Simulation generated from model'
                : 'Other';
            }),
        );
        if (value.size === 0) {
          value.add('Other');
        }
        return Array.from(value);
      },
      filterComparator: (value: string, other: string, sign = 1): number => {
        if (value === 'Other') {
          if (other === 'Other') {
            return 0;
          } else {
            return sign;
          }
        } else {
          if (other === 'Other') {
            return -sign;
          } else {
            return RowService.comparator(value, other, sign);
          }
        }
      },
    },
    {
      id: 'organizations',
      key: ['owner', 'organizations'],
      heading: 'Organizations',
      leftIcon: 'organization',
      filterable: true,
      hidden: false,
      show: false,
      getter: (project: FormattedProjectSummary): string[] => {
        return (
          project?.owner?.organizations?.map(
            (organization) => organization.name,
          ) || ['None']
        );
      },
      extraSearchGetter: (project: FormattedProjectSummary): string | null => {
        return (
          project?.owner?.organizations?.map(
            (organization) => organization.id,
          ) || ['None']
        ).join(' ');
      },
      comparator: (value: string, other: string, sign = 1): number => {
        if (value === 'None') {
          if (other === 'None') {
            return 0;
          } else {
            return sign;
          }
        } else {
          if (other === 'None') {
            return -sign;
          } else {
            return RowService.comparator(value, other, sign);
          }
        }
      },
      filterComparator: (value: string, other: string, sign = 1): number => {
        if (value === 'None') {
          if (other === 'None') {
            return 0;
          } else {
            return sign;
          }
        } else {
          if (other === 'None') {
            return -sign;
          } else {
            return RowService.comparator(value, other, sign);
          }
        }
      },
    },
    {
      id: 'owner',
      key: 'owner',
      heading: 'Owner',
      leftIcon: 'author',
      filterable: true,
      hidden: false,
      show: false,
      getter: (project: FormattedProjectSummary): string => {
        return project?.owner?.name || 'Other';
      },
      extraSearchGetter: (project: FormattedProjectSummary): string | null => {
        return project?.owner?.id || null;
      },
      comparator: (value: string, other: string, sign = 1): number => {
        if (value === 'Other') {
          if (other === 'Other') {
            return 0;
          } else {
            return sign;
          }
        } else {
          if (other === 'Other') {
            return -sign;
          } else {
            return RowService.comparator(value, other, sign);
          }
        }
      },
      filterType: ColumnFilterType.stringAutoComplete,
      filterComparator: (value: string, other: string, sign = 1): number => {
        if (value === 'Other') {
          if (other === 'Other') {
            return 0;
          } else {
            return sign;
          }
        } else {
          if (other === 'Other') {
            return -sign;
          } else {
            return RowService.comparator(value, other, sign);
          }
        }
      },
    },
    {
      id: 'creators',
      key: ['metadata', 'creators'],
      heading: 'Creators',
      leftIcon: 'author',
      filterable: true,
      hidden: false,
      show: false,
      getter: (project: FormattedProjectSummary): string[] => {
        return project.metadata.creators.map(
          (v: LabeledIdentifier) => v.label || v.uri,
        ) as string[];
      },
      extraSearchGetter: (project: FormattedProjectSummary): string => {
        return project.metadata.creators
          .map((v: LabeledIdentifier) => {
            if (!v.label && v.uri) {
              return this.processUriForSearch(v.uri);
            } else {
              return '';
            }
          })
          .join(' ');
      },
      filterType: ColumnFilterType.stringAutoComplete,
    },
    {
      id: 'contributors',
      key: ['metadata', 'contributors'],
      heading: 'Contributors',
      leftIcon: 'curator',
      filterable: true,
      hidden: false,
      show: false,
      getter: (project: FormattedProjectSummary): string[] => {
        return project.metadata.contributors.map(
          (v: LabeledIdentifier) => v.label || v.uri,
        ) as string[];
      },
      extraSearchGetter: (project: FormattedProjectSummary): string => {
        return project.metadata.contributors
          .map((v: LabeledIdentifier) => {
            if (!v.label && v.uri) {
              return this.processUriForSearch(v.uri);
            } else {
              return '';
            }
          })
          .join(' ');
      },
      filterType: ColumnFilterType.stringAutoComplete,
    },
    {
      id: 'funders',
      key: ['metadata', 'funders'],
      heading: 'Funders',
      leftIcon: 'funding',
      filterable: true,
      hidden: false,
      show: false,
      getter: (project: FormattedProjectSummary): string[] => {
        return project.metadata.funders.map(
          (v: LabeledIdentifier) => v.label || v.uri,
        ) as string[];
      },
      extraSearchGetter: (project: FormattedProjectSummary): string => {
        return project.metadata.funders
          .map((v: LabeledIdentifier) => {
            if (!v.label && v.uri) {
              return this.processUriForSearch(v.uri);
            } else {
              return '';
            }
          })
          .join(' ');
      },
    },
    {
      id: 'license',
      key: ['metadata', 'license'],
      heading: 'License',
      leftIcon: 'license',
      filterable: true,
      hidden: false,
      show: false,
      getter: (project: FormattedProjectSummary): string[] => {
        return (project.metadata.license || []).map(
          (v: LabeledIdentifier) => v.label || v.uri,
        ) as string[];
      },
      extraSearchGetter: (project: FormattedProjectSummary): string => {
        return (project.metadata.license || [])
          .map((v: LabeledIdentifier) => {
            if (!v.label && v.uri) {
              return this.processUriForSearch(v.uri);
            } else {
              return '';
            }
          })
          .join(' ');
      },
    },
    {
      id: 'created',
      key: ['metadata', 'created'],
      heading: 'Created',
      leftIcon: 'date',
      hidden: false,
      show: false,
      filterable: true,
      formatter: (value: Date): string => {
        return FormatService.formatDate(value);
      },
      filterType: ColumnFilterType.date,
    },
    {
      id: 'published',
      key: 'created',
      heading: 'Published',
      leftIcon: 'date',
      hidden: false,

      show: false,
      filterable: true,
      formatter: (value: Date): string => {
        return FormatService.formatDate(value);
      },
      filterType: ColumnFilterType.date,
    },
    {
      id: 'updated',
      key: 'updated',
      heading: 'Updated',
      leftIcon: 'date',
      hidden: false,
      show: false,
      filterable: true,
      formatter: (value: Date): string => {
        return FormatService.formatDate(value);
      },
      filterType: ColumnFilterType.date,
    },
  ];
  // TODO make this an input observable
  private defaultSort: ColumnSort = {
    active: 'title',
    direction: 'asc',
  };
  private _data = new BehaviorSubject<FormattedProjectSummary[]>([]);
  private _filter = new BehaviorSubject<FilterState>({});
  private _columns = new BehaviorSubject<Column[]>(this.initcolumns);
  private idToColumn!: IdColumnMap;

  private dataLoaded = false;
  private dataSorted = false;

  private isLoading = new BehaviorSubject<boolean>(!this.dataLoaded);
  private isSorting = new BehaviorSubject<boolean>(!this.dataSorted);

  public get columns(): Column[] {
    return this._columns.value;
  }

  public set columns(input: Column[]) {
    this._columns.next(input);
  }

  public get columns$(): Observable<Column[]> {
    return this._columns.pipe(shareReplay(1));
  }

  public set filter(value: FilterState) {
    this._filter.next(value);
  }
  public get filter(): FilterState {
    return this._filter.getValue();
  }
  public get filter$(): Observable<FilterState> {
    return this._filter.asObservable();
  }

  // TODO add type
  public processData(sortedData: any) {
    sortedData.forEach((datum: any): void => {
      const cache: any = {};
      datum['_cache'] = cache;

      this?.columns?.forEach((column: Column): void => {
        const value = RowService.getElementValue(datum, column);
        cache[column.id] = {
          value: RowService.formatElementValue(datum, value, column),
          toolTip: RowService.formatElementToolTip(datum, value, column),
          left: {},
          center: {},
          right: {},
        };

        if (column.leftAction === ColumnActionType.routerLink) {
          const tmp = RowService.getElementRouterLink(datum, column, Side.left);
          cache[column.id].left['routerLink'] = tmp.routerLink;
          cache[column.id].left['fragment'] = tmp.fragment;
        } else if (column.leftAction === ColumnActionType.href) {
          cache[column.id].left['href'] = RowService.getElementHref(
            datum,
            column,
            Side.left,
          );
        } else if (column.leftAction === ColumnActionType.click) {
          cache[column.id].left['click'] = RowService.getElementClick(
            datum,
            column,
            Side.left,
          );
        }
        cache[column.id].left['icon'] = RowService.getIcon(
          datum,
          column,
          Side.left,
        );
        cache[column.id].left['iconTitle'] = RowService.getIconTitle(
          datum,
          column,
          Side.left,
        );

        if (column.centerAction === ColumnActionType.routerLink) {
          const tmp = RowService.getElementRouterLink(
            datum,
            column,
            Side.center,
          );
          cache[column.id].center['routerLink'] = tmp.routerLink;
          cache[column.id].center['fragment'] = tmp.fragment;
        } else if (column.centerAction === ColumnActionType.href) {
          cache[column.id].center['href'] = RowService.getElementHref(
            datum,
            column,
            Side.center,
          );
        } else if (column.centerAction === ColumnActionType.click) {
          cache[column.id].center['click'] = RowService.getElementClick(
            datum,
            column,
            Side.center,
          );
        }
        // cache[column.id].center['icon'] = RowService.getIcon(datum, column, Side.center);
        // cache[column.id].center['iconTitle'] = RowService.getIconTitle(datum, column, Side.center);

        if (column.rightAction === ColumnActionType.routerLink) {
          const tmp = RowService.getElementRouterLink(
            datum,
            column,
            Side.right,
          );
          cache[column.id].right['routerLink'] = tmp.routerLink;
          cache[column.id].right['fragment'] = tmp.fragment;
        } else if (column.rightAction === ColumnActionType.href) {
          cache[column.id].right['href'] = RowService.getElementHref(
            datum,
            column,
            Side.right,
          );
        } else if (column.rightAction === ColumnActionType.click) {
          cache[column.id].right['click'] = RowService.getElementClick(
            datum,
            column,
            Side.right,
          );
        }
        cache[column.id].right['icon'] = RowService.getIcon(
          datum,
          column,
          Side.right,
        );
        cache[column.id].right['iconTitle'] = RowService.getIconTitle(
          datum,
          column,
          Side.right,
        );
      });
    });
    return sortedData;
  }
  public constructor(private service: BrowseService) {
    super();

    const init_data = this.service._getProjects();

    init_data.subscribe((data) => {
      this.idToColumn = (this.columns || []).reduce(
        (map: { [id: string]: Column }, col: Column) => {
          map[col.id] = col;
          return map;
        },
        {},
      );

      const sortedData = RowService.sortData(
        this.idToColumn,
        data,
        this.defaultSort,
      );

      this._data.next(sortedData);

      const tempColumns = this._columns.getValue();

      const processedData = this.processData(sortedData);
      this._data.next(processedData);

      tempColumns.forEach((column: Column): void => {
        if (column.filterType == ColumnFilterType.number) {
          const row = this.getNumericColumnRange(sortedData, column);
          const def: NumberFilterDefinition = {
            type: ColumnFilterType.number,
            value: {
              min: row.min,
              max: row.max,
              step: row.step,
              minSelected: row.minSelected,
              maxSelected: row.maxSelected,
            },
          };
          if (column.filterable !== false) {
            column.filterDefinition = def;
          }
        } else if (column.filterType === ColumnFilterType.date) {
          const row = this.filter?.[column.id] || [null, null];

          const def: DateFilterDefinition = {
            type: ColumnFilterType.date,
            value: {
              start: null,
              end: null,
            },
          };
          column.filterDefinition = def;
        } else {
          const row = this.getTextColumnValues(sortedData, column);
          const values = [];
          for (const v of row) {
            values.push({
              label: v.formattedValue,
              selected: false,
            });
          }
          const def: StringFilterDefinition = {
            type: ColumnFilterType.string,
            value: values,
          };

          if (column.filterable !== false) {
            column.filterDefinition = def;
          }
        }
      });

      this._columns.next(tempColumns);
    });
    this._columns.subscribe((columns: Column[]) => {});
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  public connect(): Observable<FormattedProjectSummary[]> {
    return this._data.asObservable();
  }

  /** Disconnect function called by the table, right before it unbinds. */
  public disconnect(): void {}

  private getNumericColumnRange(data: any[], column: Column): any {
    if (data.length === 0) {
      return {
        min: null,
        max: null,
        step: null,
        minSelected: null,
        maxSelected: null,
      };
    }

    const range: any = {
      min: null,
      max: null,
      step: null,
      minSelected: null,
      maxSelected: null,
    };

    for (const datum of data) {
      const value = RowService.getElementFilterValue(datum, column);
      if (value == null || value === undefined || isNaN(value)) {
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

    if (range.min != null) {
      range.min = Math.floor(range.min);
      range.max = Math.ceil(range.max);
    }

    if (column.numericFilterStep !== undefined) {
      range.step = column.numericFilterStep;
    } else if (range.max === range.min) {
      range.step = 0;
    } else {
      range.step = Math.pow(
        10,
        Math.floor(Math.log10((range.max - range.min) / 1000)),
      );
    }
    range.step = Math.max(1, range.step);

    if (column.id in this.filter) {
      range.minSelected = 0; //this.filter[column.id][0];
      range.maxSelected = 0; // this.filter[column.id][1];
    } else {
      range.minSelected = range.min;
      range.maxSelected = range.max;
    }

    return range;
  }

  private getTextColumnValues(data: any[], column: Column): any[] {
    const values: any[] = column.filterValues
      ? column.filterValues
      : data.map((datum: any): any =>
          RowService.getElementFilterValue(datum, column),
        );

    const formattedValuesMap: any = {};
    const allValues = new Set<any>();
    for (const value of values) {
      if (Array.isArray(value)) {
        for (const v of value) {
          const formattedV = RowService.formatElementFilterValue(
            value,
            v,
            column,
          );
          if (formattedV != null && formattedV !== '') {
            formattedValuesMap[v] = formattedV;
            allValues.add(v);
          }
        }
      } else {
        const formattedValue = RowService.formatElementFilterValue(
          value,
          value,
          column,
        );
        if (formattedValue != null && formattedValue !== '') {
          formattedValuesMap[value] = formattedValue;
          allValues.add(value);
        }
      }
    }

    const comparator = RowService.getFilterComparator(column);
    const formattedValuesArr = [];
    for (const value of allValues) {
      const formattedValue = {
        value: value,
        formattedValue: formattedValuesMap[value],
        checked: false,
      };
      formattedValuesArr.push(formattedValue);
    }
    formattedValuesArr.sort((a: any, b: any): number => {
      return comparator(a.value, b.value);
    });

    if (column.filterSortDirection === ColumnSortDirection.desc) {
      formattedValuesArr.reverse();
    }

    return formattedValuesArr;
  }

  private processUriForSearch(uri: string): string {
    return uri.replace(/[/#:.]/g, ' ');
  }
}
