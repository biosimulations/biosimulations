import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'biosimulations-string-filter',
  templateUrl: './string-filter.component.html',
  styleUrls: ['./string-filter.component.scss'],
})
export class StringFilterComponent {
  @Input()
  public header!: string;

  @Input()
  public values: { id: string; label: string; selected: boolean; showTooltip: boolean }[] = [];

  public constructor() {}
  @Output()
  public stringFilterChange = new EventEmitter<any>();

  @Output()
  public filterCleared = new EventEmitter<void>();
  public clearFilter() {
    this.values.forEach((value) => {
      value.selected = false;
    });
    this.stringFilterChange.emit(this.values);
    this.filterCleared.emit();
  }
  public handleStringFilterChange(id: string, checked: boolean) {
    this.values.forEach((value) => {
      if (value.id == id) {
        value.selected = checked;
      }
    });

    this.stringFilterChange.emit(this.values);
  }
}
