import { AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { ProjectFilterQueryItem, ProjectFilterStatsItem, ProjectFilterTarget } from '@biosimulations/datamodel/common';
import { Observable } from 'rxjs';
import { MatListOption } from '@angular/material/list';

@Component({
  selector: 'biosimulations-project-filter',
  templateUrl: './project-filter.component.html',
  styleUrls: ['./project-filter.component.scss'],
})
export class ProjectFilterComponent implements AfterViewInit {
  @ViewChildren(MatListOption) matListOptionChildren!: QueryList<MatListOption>;
  @Input() filterStats$!: Observable<ProjectFilterStatsItem[]>;
  @Output() filterQueryChanged = new EventEmitter<ProjectFilterQueryItem[]>();
  private filterQueryItemMap = new Map<ProjectFilterTarget, ProjectFilterQueryItem>();

  public onSelectedChange(selected: boolean, target: ProjectFilterTarget, value: string) {
    console.log(`onSelectionChange() selected=${selected}, target=${target}, value=${value}`);
    const prev_allowable_set: Set<string> = new Set<string>();
    this.filterQueryItemMap.get(target)?.allowable_values.forEach((value) => prev_allowable_set.add(value));
    if (selected) {
      prev_allowable_set.add(value);
    } else {
      prev_allowable_set.delete(value);
    }
    if (prev_allowable_set.size == 0) {
      this.filterQueryItemMap.delete(target);
    } else {
      this.filterQueryItemMap.set(target, { target: target, allowable_values: [...prev_allowable_set] });
    }
    this.filterQueryChanged.emit(Array.from(this.filterQueryItemMap.values()));
  }

  public isSelected(target: ProjectFilterTarget, value: string): boolean {
    const projectFilterQueryItem: ProjectFilterQueryItem | undefined = this.filterQueryItemMap.get(target);
    if (projectFilterQueryItem) {
      return projectFilterQueryItem.allowable_values.some((str) => str == value);
    } else {
      return false;
    }
  }

  public ngAfterViewInit() {
    const _dummy = 'no-op';
  }
}
