import { Component, Output, Input, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ControlColumn } from '../controls';

@Component({
  selector: 'biosimulations-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectComponent {
  constructor() {}

  @Input()
  public expanded = false;

  @Input()
  public disabled = false;

  @Input()
  public heading = 'Attributes';

  @Input()
  public columns: ControlColumn[] = [];

  @Output()
  public opened: EventEmitter<void> = new EventEmitter();

  @Output()
  public columnsChange: EventEmitter<ControlColumn[]> = new EventEmitter();

  public passOpen(): void {
    this.opened.emit();
  }

  public toggleColumn(event: MatCheckboxChange, column: ControlColumn): void {
    column.show = event.checked;
    this.columnsChange.emit(this.columns);
  }
}
