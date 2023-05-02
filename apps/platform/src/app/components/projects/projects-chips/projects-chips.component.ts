import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BehaviorSubject, filter, mergeMap, Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProjectFilterQueryItem, ProjectFilterStatsItem, ProjectFilterTarget } from '@biosimulations/datamodel/common';
import { MatChipInputEvent } from '@angular/material/chips';

export interface FilterChoiceOption {
  target: ProjectFilterTarget;
  value: string;
}

@Component({
  selector: 'biosimulations-projects-chips',
  templateUrl: './projects-chips.component.html',
  styleUrls: ['./projects-chips.component.scss'],
})
export class ProjectsChipsComponent {
  @ViewChild('filterInput') filterInput!: ElementRef<HTMLInputElement>;
  @Input() filterStats$!: Observable<ProjectFilterStatsItem[]>;
  @Output() filterQueries$ = new EventEmitter<ProjectFilterQueryItem[]>();
  private filterQueryItemMap = new Map<ProjectFilterTarget, ProjectFilterQueryItem>();
  public allFilterChoiceOptions$ = new BehaviorSubject<FilterChoiceOption[]>([]);
  public filteredChoiceOptions$!: Observable<FilterChoiceOption[]>;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filterCtrl = new FormControl('');

  public ngAfterViewInit() {
    this.filterStats$.subscribe((filterStatItems: ProjectFilterStatsItem[]) => {
      this.allFilterChoiceOptions$.next(this.getFilterChoiceOptions(filterStatItems));
    });
  }

  constructor() {
    this.filteredChoiceOptions$ = this.filterCtrl.valueChanges.pipe(
      startWith(null),
      mergeMap((filterString) =>
        this.allFilterChoiceOptions$.pipe(
          map((filterChoiceOptions) => this._filterMany(filterString, filterChoiceOptions)),
        ),
      ),
    );
  }

  public getFilterChoiceOptions(filterStatItems: ProjectFilterStatsItem[]): FilterChoiceOption[] {
    const filterChoiceOptions: FilterChoiceOption[] = [];
    for (const filterStatItem of filterStatItems) {
      const target = filterStatItem.target;
      for (const valueFrequency of filterStatItem.valueFrequencies) {
        filterChoiceOptions.push({ target: target, value: valueFrequency.value });
      }
    }
    return filterChoiceOptions;
  }

  private getFilterChoiceOption(filterStatItem: ProjectFilterStatsItem): FilterChoiceOption[] {
    const filterChoiceOptions: FilterChoiceOption[] = [];
    const target = filterStatItem.target;
    for (const valueFrequency of filterStatItem.valueFrequencies) {
      filterChoiceOptions.push({ target: target, value: valueFrequency.value });
    }
    return filterChoiceOptions;
  }

  add(event: MatChipInputEvent): void {
    console.log('add(event=' + event + ') does nothing now');
    // const value = (event.value || "").trim();
    //
    // // Add our fruit
    // if (value) {
    //   this.filters.push(value);
    // }
    //
    // // Clear the input value
    // event.chipInput.clear();
    //
    // this.filterCtrl.setValue(null);
  }

  remove(filter: ProjectFilterQueryItem): void {
    console.log('remove(filter=' + filter + ')');
    this.onRemoveTarget(filter.target);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log('selected(event=' + event + ')');
    this.filterInput.nativeElement.value = '';
    this.filterCtrl.setValue(null);
    const tokens: string[] = event.option.viewValue.split(':');
    const target: ProjectFilterTarget = tokens[0] as ProjectFilterTarget;
    const value: string = tokens[1];
    this.onSelectedChange(true, target, value.trim());
  }

  private _filter(value: string | null, filterChoiceOption: FilterChoiceOption): boolean {
    if (value == null) return true;
    const filterValue: string = value.toLowerCase();
    return filterChoiceOption.value.toLowerCase().includes(filterValue);
  }

  private _filterMany(
    value: FilterChoiceOption | string | null,
    filterChoiceOptions: FilterChoiceOption[],
  ): FilterChoiceOption[] {
    if (value == null || typeof value == 'object') return filterChoiceOptions;
    const filterValue: string = value.toLowerCase();
    return filterChoiceOptions.filter((filterChoiceOption) =>
      (filterChoiceOption.target + ': ' + filterChoiceOption.value).toLowerCase().includes(filterValue),
    );
  }

  public onRemoveTarget(target: ProjectFilterTarget) {
    console.log(`onRemoveTarget() target=${target}`);
    const deleted: boolean = this.filterQueryItemMap.delete(target);
    if (deleted) {
      this.filterQueries$.emit(Array.from(this.filterQueryItemMap.values()));
    }
  }

  public onSelectedChange(selected: boolean, target: ProjectFilterTarget, value: string) {
    console.log(`onSelectionChange() selected=${selected}, target=${target}, value=${value}`);
    const prev_allowable_set: Set<string> = new Set<string>();
    this.filterQueryItemMap.get(target)?.allowable_values.forEach((value) => prev_allowable_set.add(value));
    const new_allowable_set: Set<string> = new Set<string>([...prev_allowable_set]);
    if (selected) {
      new_allowable_set.add(value);
    } else {
      new_allowable_set.delete(value);
    }
    if (new_allowable_set.size == 0) {
      this.filterQueryItemMap.delete(target);
    } else {
      this.filterQueryItemMap.set(target, { target: target, allowable_values: [...new_allowable_set] });
    }
    if ([...prev_allowable_set].sort().toString() !== [...new_allowable_set].sort().toString()) {
      this.filterQueries$.emit(Array.from(this.filterQueryItemMap.values()));
    }
  }

  public isSelected(target: ProjectFilterTarget, value: string): boolean {
    const projectFilterQueryItem: ProjectFilterQueryItem | undefined = this.filterQueryItemMap.get(target);
    if (projectFilterQueryItem) {
      return projectFilterQueryItem.allowable_values.some((str) => str == value);
    } else {
      return false;
    }
  }
}
