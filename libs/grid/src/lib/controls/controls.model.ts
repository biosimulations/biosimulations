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
}

export class NumberFilterRange {
  public min!: number;
  public max!: number;
  public step!: number;
  public minSelected!: number;
  public maxSelected!: number;
}

export class NumberFilterState {
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
  public numberFilterState: NumberFilterState | null = null;
  public setFilterState: {
    column: ControlColumn;
    // atribute value
    value: any;
    selected: boolean;
  } | null = null;
  public startDateState: {
    column: ControlColumn | null;
    date: Date | null;
  } | null = null;
  public endDateState: {
    column: ControlColumn | null;
    date: Date | null;
  } | null = null;

  public autoCompleteFilterState: {
    column: ControlColumn;
    value: string;
  } | null = null;
}
