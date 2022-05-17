import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';

import { ControlColumn } from '../controls';
import { DateFilterDefinition, FilterDefinition, NumberFilterRange } from '../filters';
import { DateRange } from './date-filter/date-filter.component';

@Component({
  selector: 'biosimulations-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  // The inner expansion panels are rendered lazily so cannot be OnPush
  changeDetection: ChangeDetectionStrategy.Default,
  viewProviders: [MatExpansionPanel],
})
export class FilterComponent implements OnInit {
  /**
   * Whether to expand the panel with the filter
   */
  @Input()
  public expanded = false;

  /**
   * Whether the panel can be opened/closed
   */
  @Input()
  public disabled = false;

  /**
   * the heading of the panel
   */
  @Input()
  public heading = 'Filters';

  /**
   * The definitions of the columns and their current state
   */

  @Input()
  public columns: ControlColumn[] = [];

  /**
   * Emitted when the panel is opened
   */
  @Output()
  public opened: EventEmitter<void> = new EventEmitter();

  @Output()
  public columnsChanged = new EventEmitter<ControlColumn[]>();

  public filterFormGroup!: FormGroup;

  /**
   * Handles the opened event of the panel and re emits it
   */
  public passOpen(): void {
    this.opened.emit();
  }
  private emitColumns(): void {
    this.columnsChanged.emit(this.columns);
  }

  // TODO it might be good to make this whole component a form, and have each subpart be in own form
  private getControl(filterDefinition: FilterDefinition): AbstractControl {
    switch (filterDefinition.type) {
      case 'date':
        break;
      case 'number':
        break;
      case 'string':
        break;
      default:
        break;
    }

    return new FormControl(filterDefinition.value);
  }
  public ngOnInit(): void {
    const controls: { [key: string]: AbstractControl } = {};
    this.columns.forEach((c) => {
      if (c.filterDefinition) {
        controls[c.id] = this.getControl(c.filterDefinition);
      }
    });
    this.filterFormGroup = new FormGroup(controls);
  }

  // TODO generalize?
  public handleAutoCompleteFilterChange(id: string, event: { label: string; selected: boolean }[]) {
    this.columns.forEach((c) => {
      if (c.id === id && c.filterDefinition && c.filterDefinition.type === 'stringAutoComplete') {
        c.filterDefinition.value = event;
      }
    });
    this.emitColumns();
  }

  public handleDateFilterChange(id: string, event: DateRange) {
    this.columns.forEach((c) => {
      if (c.id === id && c.filterDefinition && c.filterDefinition.type === 'date') {
        (c.filterDefinition as DateFilterDefinition).value = event;
      }
    });

    this.emitColumns();
  }
  public handleStringFilterChange(id: string, event: { label: string; selected: boolean }[]) {
    this.columns.forEach((c) => {
      if (c.id === id && c.filterDefinition && c.filterDefinition.type === 'string') {
        c.filterDefinition.value = event;
      }
    });
    this.emitColumns();
  }
  public handleNumberFilterChange(id: string, event: NumberFilterRange) {
    this.columns.forEach((c) => {
      if (c.id === id && c.filterDefinition) {
        c.filterDefinition.value = event;
      }
    });
    this.emitColumns();
  }
  public constructor() {}
}
