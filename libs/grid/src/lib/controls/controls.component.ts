import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Column } from '../columns';

import { ControlColumn, ControlsState, NumberFilterStateChange } from './controls.model';

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
  public searchQuery: string | null = null;

  @Output()
  public controlsStateChanged = new EventEmitter<ControlsState>();

  @Output()
  public filtersCleared = new EventEmitter<ControlColumn>();

  public numberFilterState!: NumberFilterStateChange;

  public startDateState: { column: Column; date: Date | null } | null = null;
  public endDateState: { column: Column; date: Date | null } | null = null;

  public autoCompleteFilterState: { column: Column; value: string } | null = null;

  public handleColumnsChange(event: ControlColumn[]): void {
    this.columns = event;
    this.updateControlsState();
  }
  public ngOnInit(): void {
    this.columns.forEach((column) => {
      column._visible = column.show;      
    });
  }

  public handleSearch(search: string): void {
    this.searchQuery = search;
    this.updateControlsState();
  }

  public toggleControls(): void {
    this.controlsOpen = !this.controlsOpen;
    this.updateControlsState();
  }

  public openControlPanel(id: number): void {
    if (id != this.openControlPanelId) {
      this.openControlPanelId = id;
      this.updateControlsState();
    }
  }

  public updateControlsState(): void {
    const controlState: ControlsState = {
      openControlPanelId: this.openControlPanelId,
      searchQuery: this.searchQuery,
      controlsOpen: this.controlsOpen,
      columns: this.columns,
    };

    this.controlsStateChanged.emit(controlState);
  }
}
