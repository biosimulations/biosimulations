import { ColumnFilterType } from '../filters';
import { FilterDefinition, FilterState, NumberFilterRange } from '../filters';

export class ControlColumn {
  public id!: string;

  public heading!: string;

  // Whether the attribute is visible in the controls panel
  public hidden?: boolean;

  // Whether the attribute is selected
  public show?: boolean;

  // The filter of the attribute. If undefined, no filter is created
  public filterDefinition?: FilterDefinition;

  public units?: string;

  public showFilterItemToolTips?: boolean;
}

export type SetFilterableColumn = ControlColumn & {
  filterType: ColumnFilterType.string;
  filterValues: string[];
};
export type DateFilterableColumn = ControlColumn & {
  filterType: ColumnFilterType.date;
  start: Date;
};

type FilterSearchState = {
  searchQuery: searchQuery;
  filterState: FilterState;
};

type searchQuery = string | null;

export class NumberFilterStateChange {
  public column!: ControlColumn;
  public range!: NumberFilterRange;
  public $event!: number[];
}
export class ControlsState {
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  public openControlPanelId: number = 1;
  public controlsOpen = true;
  public columns: ControlColumn[] = [];
  public searchQuery: searchQuery = null;
}

export class ControlStateChange {
  public searchQuery: string | null = null;
  public filterState?: FilterState;

  public autoCompleteFilterState: {
    column: ControlColumn;
    value: string;
  } | null = null;
}
