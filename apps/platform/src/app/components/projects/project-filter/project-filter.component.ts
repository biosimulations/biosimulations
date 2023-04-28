import { AfterViewInit, Component, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { ProjectFilterQueryItem, ProjectFilterStatsItem, ProjectFilterTarget } from '@biosimulations/datamodel/common';
import { Observable } from 'rxjs';
import { MatListOption, MatSelectionListChange } from '@angular/material/list';

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

  public onSelectionChange($event: MatSelectionListChange, stat: ProjectFilterStatsItem) {
    console.log(`onSelectionChange() stat=${stat.target}, changeEvent=${$event}`);
    const newFilterQueryItem: ProjectFilterQueryItem = {
      target: stat.target,
      allowable_values: $event.options
        .filter((matListOption: MatListOption) => matListOption.selected)
        .map((matListOption: MatListOption) => matListOption.value as string),
    };
    this.filterQueryItemMap.set(stat.target, newFilterQueryItem);
    this.filterQueryChanged.emit(Array.from(this.filterQueryItemMap.values()));
  }

  public ngAfterViewInit() {
    const _dummy = 'no-op';
  }
}
