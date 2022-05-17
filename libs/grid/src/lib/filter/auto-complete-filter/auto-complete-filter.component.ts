import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable } from 'rxjs';
export type AutoCompleteValue = { selected: boolean; label: string };
export type AutoCompleteValues = AutoCompleteValue[];
@Component({
  selector: 'biosimulations-auto-complete-filter',
  templateUrl: './auto-complete-filter.component.html',
  styleUrls: ['./auto-complete-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoCompleteFilterComponent {
  @Input()
  public heading!: string;

  @Input()
  public values: AutoCompleteValues = [];

  public filteredValues!: Observable<AutoCompleteValues>;

  public autoCompleteForm: FormControl = new FormControl();

  @Output()
  public autoCompleteFilterChange = new EventEmitter<AutoCompleteValues>();

  public clearFilter() {
    const newValues = this.values.map((v) => {
      v.selected = false;
      return v;
    });
    this.setValues(newValues);
  }

  private setValues(values: AutoCompleteValues) {
    this.values = values;
    this.autoCompleteFilterChange.emit(this.values);
  }

  public handleFilterSetValue(value: AutoCompleteValue, selected: boolean) {
    const newValues = this.values.map((v) => {
      if (v.label === value.label) {
        v.selected = selected;
      }
      return v;
    });
    this.setValues(newValues);
  }

  public ngOnInit() {
    this.filteredValues = this.autoCompleteForm.valueChanges.pipe(map(this.evalAutoCompleteFilter.bind(this)));
  }

  public evalAutoCompleteFilter(value: string): AutoCompleteValues {
    if (!value) {
      return this.values;
    }
    return this.values.filter((v) => v?.label && v.label.toLowerCase().includes(value.toLowerCase()));
  }

  public constructor() {}
}
