import { Component, EventEmitter, Input, Output } from '@angular/core';

type StringFilterValues = { label: string; selected: boolean; showTooltip: boolean }[];
@Component({
  selector: 'biosimulations-string-filter',
  templateUrl: './string-filter.component.html',
  styleUrls: ['./string-filter.component.scss'],
})
export class StringFilterComponent {
  @Input()
  public header!: string;

  @Input()
  public values: StringFilterValues = [];

  public constructor() {}
  @Output()
  public stringFilterChange = new EventEmitter<StringFilterValues>();

  @Output()
  public filterCleared = new EventEmitter<void>();
  public clearFilter() {
    this.values.forEach((value) => {
      value.selected = false;
    });
    this.stringFilterChange.emit(this.values);
    this.filterCleared.emit();
  }
  public handleStringFilterChange(label: string, checked: boolean) {
    this.values.forEach((value) => {
      if (value.label == label) {
        value.selected = checked;
      }
    });

    this.stringFilterChange.emit(this.values);
  }
}
