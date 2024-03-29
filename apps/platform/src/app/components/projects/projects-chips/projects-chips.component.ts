import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { BehaviorSubject, mergeMap, Observable, startWith } from 'rxjs';
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
export class ProjectsChipsComponent implements AfterViewInit {
  @ViewChild('filterInput') private filterInput!: ElementRef<HTMLInputElement>;
  @Input() public filterStats$!: Observable<ProjectFilterStatsItem[]>;
  @Output() public filterQueries$ = new EventEmitter<ProjectFilterQueryItem[]>();
  public filteredChoiceOptions$!: Observable<FilterChoiceOption[]>;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public filterCtrl = new FormControl('');

  private filterQueryItemMap = new Map<ProjectFilterTarget, ProjectFilterQueryItem>();
  private allFilterChoiceOptions$ = new BehaviorSubject<FilterChoiceOption[]>([]);

  public ngAfterViewInit(): void {
    this.filterStats$.subscribe((filterStatItems: ProjectFilterStatsItem[]) => {
      this.allFilterChoiceOptions$.next(this.getFilterChoiceOptions(filterStatItems));
    });
  }

  public constructor() {
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

  public add(event: MatChipInputEvent): void {
    console.log('add(event=' + event + ') does nothing now');
  }

  public remove(filter: ProjectFilterQueryItem): void {
    console.log('remove(filter=' + filter + ')');
    this.onRemoveTarget(filter.target);
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
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

  public onRemoveTarget(target: ProjectFilterTarget): void {
    const deleted: boolean = this.filterQueryItemMap.delete(target);
    if (deleted) {
      this.filterQueries$.emit(Array.from(this.filterQueryItemMap.values()));
    }
  }

  public onSelectedChange(selected: boolean, target: ProjectFilterTarget, value: string): void {
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
    const compareFn = (a: string, b: string): number => a.localeCompare(b);
    if ([...prev_allowable_set].sort(compareFn).toString() !== [...new_allowable_set].sort(compareFn).toString()) {
      this.filterQueries$.emit(Array.from(this.filterQueryItemMap.values()));
    }
  }
}
