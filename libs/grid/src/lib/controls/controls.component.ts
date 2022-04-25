import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Column } from '../columns';
import {
  ColumnFilterType,
  NumberFilterRange,
  FilterState,
  isDateFilterDefinition,
  DateFilterDefinition,
} from '../filters';

import {
  ControlColumn,
  ControlsState,
  NumberFilterStateChange,
  ControlStateChange,
} from './controls.model';

@Component({
  selector: 'biosimulations-grid-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class GridControlsComponent {
  private controlsOpen = true;

  @Input()
  public openControlPanelId = 1;
  @Input()
  public attributesHeading = 'Columns';

  @Input()
  public searchPlaceHolder!: string;

  @Input()
  public searchToolTip!: string;

  @Input()
  public closeable = false;

  @Input()
  public columns: Column[] = [];

  @Input()
  public columnFilterData: { [key: string]: any } = {};

  private filterState: FilterState = {};

  @Input()
  public searchQuery: string | null = null;

  @Output()
  public controlsStateUpdated = new EventEmitter<ControlsState>();

  @Output()
  public filterStateUpdated = new EventEmitter<ControlStateChange>();

  @Output()
  public filtersCleared = new EventEmitter<ControlColumn>();

  @Output()
  public searchQueryUpdated = new EventEmitter<string>();

  @Output()
  public filterChanged = new EventEmitter<FilterState>();

  public numberFilterState!: NumberFilterStateChange;

  public startDateState: { column: Column; date: Date | null } | null = null;
  public endDateState: { column: Column; date: Date | null } | null = null;

  public autoCompleteFilterState: { column: Column; value: string } | null =
    null;

  public ngOnInit(): void {
    this.columns.forEach((column) => {
      column._visible = column.show;
      if (column.filterable) {
        if (column.filterDefinition) {
          this.filterState[column.id] = column.filterDefinition;
        } else if (column.filterType) {
          if (column.filterType === ColumnFilterType.number) {
            this.filterState[column.id] = {
              type: column.filterType,
              value: {
                min: null,
                max: null,
              },
            };
          } else if (column.filterType === ColumnFilterType.date) {
            this.filterState[column.id] = {
              type: column.filterType,
              value: {
                start: null,
                end: null,
              },
            };
          } else if (column.filterType === ColumnFilterType.string) {
            this.filterState[column.id] = {
              type: column.filterType,
              value: [],
            };
          } else {
            this.filterState[column.id] = {
              type: column.filterType,
              value: '',
            };
          }
        }
      }
    });
  }

  public evalAutocompleteFilter(column: Column, value: string) {
    this.autoCompleteFilterState = {
      column,
      value,
    };
    this.updateFiltersState();
  }

  public handleSearch(search: string): void {
    this.searchQuery = search;
    this.searchQueryUpdated.emit(search);
  }

  public clearFilter(column: Column): void {
    this.filterState[column.id] = undefined;
  }
  public handleNumberFilterChange(
    column: Column,
    range: NumberFilterRange,
    $event: number[],
  ): void {
    this.filterState[column.id] = {
      type: ColumnFilterType.number,
      value: range,
    };

    this.updateFiltersState();
  }

  public handleStartDateFilterChange(
    column: Column,
    event: MatDatepickerInputEvent<Date>,
    endDate: Date | null,
  ): void {
    const startDate: Date | null = event.value;

    console.error(this.filterState);
    if (isDateFilterDefinition(this.filterState[column.id])) {
      (this.filterState[column.id] as DateFilterDefinition).value = {
        start: startDate,
        end: endDate,
      };
      this.updateFiltersState();
    }
  }

  public handleEndDateFilterChange(
    column: Column,
    event: MatDatepickerInputEvent<Date>,
  ): void {
    const date: Date | null = event.value;
    this.startDateState = {
      column,
      date,
    };
    this.updateFiltersState();
  }

  public handleFilterSetValue(
    column: Column,
    value: any,
    selected: boolean,
  ): void {
    let columnState = this.filterState[column.id];
    if (!columnState) {
      columnState = {
        type: ColumnFilterType.string,
        value: selected ? [value] : [],
      };
    } else if (columnState.type === ColumnFilterType.string) {
      // if the value is selected,add it to the list of values if it is not already there
      // otherwise, remove it from the list of values
      columnState.value = selected
        ? columnState.value.includes(value.value)
          ? columnState.value
          : columnState.value.concat(value.value)
        : columnState.value.filter((v) => v !== value.value);
    }
    console.error(columnState);
    this.filterState[column.id] = columnState;
    this.updateFiltersState();
  }

  public toggleControls(): void {
    this.controlsOpen = !this.controlsOpen;
    this.updateControlsState();
  }
  public toggleColumn(event: MatCheckboxChange, column: ControlColumn): void {
    const checked = event.checked;
    column._visible = checked;

    this.updateControlsState();
  }

  public openControlPanel(id: number): void {
    if (id != this.openControlPanelId) {
      this.openControlPanelId = id;
      this.updateControlsState();
    }
  }

  public updateFiltersState(): void {
    const controlStateChange: ControlStateChange = {
      searchQuery: this.searchQuery,
      filterState: this.filterState,
      autoCompleteFilterState: this.autoCompleteFilterState,
    };
    this.filterStateUpdated.emit(controlStateChange);
  }
  public updateControlsState(): void {
    const controlState: ControlsState = {
      openControlPanelId: this.openControlPanelId,
      controlsOpen: this.controlsOpen,
      columns: this.columns,
    };

    this.controlsStateUpdated.emit(controlState);
  }
}
