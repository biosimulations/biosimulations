import { Component, EventEmitter, Input, Output } from '@angular/core';
type NumberFilterRange = {
  min?: number;
  max?: number;
  step?: number;
  minSelected?: number;
  maxSelected?: number;
};
@Component({
  selector: 'biosimulations-number-filter',
  templateUrl: './number-filter.component.html',
  styleUrls: ['./number-filter.component.scss'],
})
export class NumberFilterComponent {
  @Input()
  public range: NumberFilterRange = {};

  @Output()
  public numberFilterChange = new EventEmitter<any>();

  public handleNumberFilterChange(range: any, $event: any) {
    const newRange = {
      min: range.min,
      max: range.max,
      step: range.step,
      minSelected: $event[0],
      maxSelected: $event[1],
    };
    this.updateRange(newRange);
  }

  private updateRange(range: NumberFilterRange) {
    if (!this.areEqual(this.range, range)) {
      this.range = range;
      this.numberFilterChange.emit(this.range);
    }
  }

  private areEqual(a: NumberFilterRange, b: NumberFilterRange): boolean {
    return (
      a.min === b.min &&
      a.max === b.max &&
      a.step === b.step &&
      a.minSelected === b.minSelected &&
      a.maxSelected === b.maxSelected
    );
  }

  public clearFilter() {
    const range = {
      ...this.range,
      minSelected: this.range.min,
      maxSelected: this.range.max,
    };
    this.updateRange(range);
  }

  public constructor() {}
}
