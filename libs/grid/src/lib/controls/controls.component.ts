import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Column } from '../columns';
import {
  ColumnFilterType,
  NumberFilterRange,
  FilterState,
  isDateFilterDefinition,
  DateFilterDefinition,
  FilterDefinition,
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
  public columns!: Column[];

  public filterState: FilterState = {};

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

  private static updateStartDateFilterDefinition(
    currentDefinition: DateFilterDefinition,
    startDate: Date | null,
  ): DateFilterDefinition {
    if (!startDate) {
      return currentDefinition;
    }
    return {
      ...currentDefinition,
      value: {
        ...currentDefinition.value,
        start: startDate,
      },
    };
  }

  private static makeFilterState(
    currentState: FilterState,
    columnId: string,
    update: FilterDefinition,
  ): FilterState {
    const newState = { ...currentState };
    newState[columnId] = update;
    return newState;
  }

  public ngOnInit(): void {
    this.columns.forEach((column) => {
      column._visible = column.show;
      this.filterState[column.id] = column.filterDefinition;
    });
  }
  public evalAutocompleteFilter(column: Column, value: string) {
    this.autoCompleteFilterState = {
      column,
      value,
    };
    //this.updateFiltersState();
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
    const minSelected = $event[0];
    const maxSelected = $event[1];
    const newRange = {
      min: range.min,
      max: range.max,
      minSelected,
      maxSelected,
      step: range.step,
    };

    this.filterState[column.id] = {
      type: ColumnFilterType.number,
      value: newRange,
    };

    //this.updateFiltersState();
  }

  public handleStartDateFilterChange(
    column: Column,
    event: MatDatepickerInputEvent<Date>,
  ): void {
    const startDate: Date | null = event.value;

    const filterDef = this.getColumnFilterDefinition(column);

    if (isDateFilterDefinition(filterDef)) {
      const newDefinition =
        GridControlsComponent.updateStartDateFilterDefinition(
          filterDef,
          startDate,
        );
      const newState = GridControlsComponent.makeFilterState(
        this.getCurrentFilterState(),
        column.id,
        newDefinition,
      );

      this.filterState[column.id] = newDefinition;

      this.updateFiltersState(newState);
    }
  }

  private getCurrentFilterState(): FilterState {
    return this.filterState;
  }
  private getColumnFilterDefinition(
    column: Column,
  ): FilterDefinition | undefined {
    return this.getCurrentFilterState()[column.id];
  }

  public handleEndDateFilterChange(
    column: Column,
    event: MatDatepickerInputEvent<Date>,
  ): void {
    const startDate: Date | null = event.value;

    const filterDef = this.getColumnFilterDefinition(column);

    if (isDateFilterDefinition(filterDef)) {
      const newDefinition = this.updateEndDateFilterDefinition(
        filterDef,
        startDate,
      );
      const newState = GridControlsComponent.makeFilterState(
        this.getCurrentFilterState(),
        column.id,
        newDefinition,
      );

      this.filterState[column.id] = newDefinition;

      this.updateFiltersState(newState);
    }
  }

  private updateEndDateFilterDefinition(
    currentDefinition: DateFilterDefinition,
    endDate: Date | null,
  ): DateFilterDefinition {
    if (!endDate) {
      return currentDefinition;
    }
    return {
      ...currentDefinition,
      value: {
        ...currentDefinition.value,
        start: endDate,
      },
    };
  }
  public handleFilterSetValue(
    column: Column,
    value: { label: string; selected: boolean },
    selected: boolean,
  ): void {
    let columnState = this.filterState[column.id];

    if (!columnState) {
      columnState = {
        type: ColumnFilterType.string,
        value: [
          {
            label: value.label,
            selected,
          },
        ],
      };
    } else if (columnState.type === ColumnFilterType.string) {
      const label = value.label;
      const filterDefValues = columnState.value.map((v) => {
        if ((v as any).label === label) {
          return {
            label,
            selected,
          };
        }
        return v;
      });

      columnState.value = filterDefValues;
    }

    this.filterState[column.id] = columnState;

    this.updateFiltersState(this.filterState);
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

  public updateFiltersState(state: FilterState): void {
    this.filterState = state;

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
