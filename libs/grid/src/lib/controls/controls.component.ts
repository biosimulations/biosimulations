import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Column } from '@biosimulations/shared/ui';

import {
  ControlColumn,
  ControlsState,
  NumberFilterState,
  NumberFilterRange,
  ControlStateChange,
} from './controls.model';

@Component({
  selector: 'biosimulations-grid-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  @Output()
  public controlsStateUpdated = new EventEmitter<ControlsState>();

  @Output()
  public filterStateUpdated = new EventEmitter<ControlStateChange>();

  @Output()
  public filtersCleared = new EventEmitter<ControlColumn>();

  @Output()
  public searchQueryUpdated = new EventEmitter<string>();
  @Input()
  public columnFilterData: { [key: string]: any } = {};

  public numberFilterState!: NumberFilterState;
  @Input()
  public searchQuery: string | null = null;
  public startDateState: { column: Column; date: Date | null } | null = null;
  public endDateState: { column: Column; date: Date | null } | null = null;
  public setFilterValue: {
    column: Column;
    value: any;
    selected: boolean;
  } | null = null;
  public autoCompleteFilterState: { column: Column; value: string } | null =
    null;

  public ngOnInit(): void {
    this.columns.forEach((column) => {
      column._visible = column.show;
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
    this.filtersCleared.emit(column);
  }

  public handleNumberFilterChange(
    column: Column,
    range: NumberFilterRange,
    $event: number[],
  ): void {
    this.numberFilterState = {
      column,
      range,
      $event,
    };

    this.updateFiltersState();
  }

  public handleStartDateFilterChange(
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
    this.setFilterValue = {
      column,
      value,
      selected,
    };
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
      numberFilterState: this.numberFilterState,
      startDateState: this.startDateState,
      endDateState: this.endDateState,
      setFilterState: this.setFilterValue,
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
