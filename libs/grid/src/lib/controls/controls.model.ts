import { ColumnFilterType } from '../filters';
import { FilterDefinition, FilterState, NumberFilterRange } from '../filters';

export class ControlColumn {
  public id!: string;

  public heading!: string;

  // Whether the attribute is visible in the controls panel
  public hidden?: boolean;

  // Whether the attribute should be shown by default
  public show?: boolean;

  // Whether the attribute is currently selected
  public _visible?: boolean;

  // Whether there should be a filter created for this attribute
  public filterable? = true;

  // The filter of the attribute
  public filter?: FilterDefinition;
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
  searchQuery: searchState;
  filterState: FilterState;
};

type searchState = string | null;

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
}

export class ControlStateChange {
  public searchQuery: string | null = null;
  public filterState?: FilterState;

  public autoCompleteFilterState: {
    column: ControlColumn;
    value: string;
  } | null = null;
}
