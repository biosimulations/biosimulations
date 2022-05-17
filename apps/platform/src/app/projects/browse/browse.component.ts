import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { combineLatest, map, mergeMap, Observable, of } from 'rxjs';
import { BrowseService } from './browse.service';
import { FormattedProjectSummary } from './browse.model';

import { ScrollService } from '@biosimulations/shared/angular';
import { ControlsState, ControlColumn, Column, FilterState } from '@biosimulations/grid';
import { BrowseDataSource } from './datasource/datasource.service';
import { ProjectCardInput } from '../project-card/project-card.component';

@Component({
  selector: 'biosimulations-projects-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit, AfterViewInit {
  public projects$!: Observable<FormattedProjectSummary[]>;

  public columns$!: Observable<Column[]>;
  public projectCardInputs$: Observable<ProjectCardInput[]> = of([]);
  public openControlPanelId = 1;
  public columnFilterData: { [key: string]: any } = {};
  public data$: Observable<FormattedProjectSummary[]>;
  public constructor(
    private service: BrowseService,
    private route: ActivatedRoute,
    private scrollService: ScrollService,
    private dataService: BrowseDataSource,
  ) {
    this.openControls = this.openControls.bind(this);
    this.data$ = this.dataService.connect();
  }

  public ngOnInit(): void {
    this.projects$ = this.dataService.connect();
    this.columns$ = this.dataService.columns$;

    this.projectCardInputs$ = this.projects$.pipe(
      mergeMap((projects: FormattedProjectSummary[]): Observable<ProjectCardInput[]> => {
        const projectArr: Observable<ProjectCardInput>[] = projects.map(
          (project: FormattedProjectSummary): Observable<ProjectCardInput> => {
            return this.columns$.pipe(
              map((columns: Column[]) => {
                const data: any[] = [];
                const cache = project?._cache;
                columns.forEach((column: Column) => {
                  const columnId = column?.id;

                  if (columnId && cache) {
                    data.push({
                      heading: column.heading,
                      value: project._cache[columnId].value,
                      icon: project._cache[columnId].left.icon,
                      show: column.show || false,
                    });
                  }
                });
                return {
                  route: `/projects/${project?.id}`,
                  title: project?.title,
                  thumbnail: project?.metadata?.thumbnail || './assets/images/loading.svg',
                  data,
                  filtered: project.filtered || false,
                };
              }),
            );
          },
        );
        return combineLatest(projectArr);
      }),
    );

    if (this.route.snapshot.fragment) {
      const opts = new URLSearchParams(this.route.snapshot.fragment) as any;
      for (const key of opts.keys()) {
        if (['search', 'sort', 'sortDir', 'columns', 'panel'].includes(key) || key.startsWith('filter.')) {
          this.controlsOpen = true;
          break;
        }
      }
    }
  }

  public ngAfterViewInit(): void {
    this.scrollService.init();
  }

  public controlsOpen = false;

  public openControls(route: string, router: Router): void {
    this.controlsOpen = !this.controlsOpen;
    if (this.controlsOpen) {
      this.scrollService.scrollToTop();
    }
  }

  public controlsStateUpdated(state: ControlsState): void {
    const columns = state.columns;
    const filterState: FilterState = {};
    columns.forEach((column) => {
      filterState[column.id] = column.filterDefinition;
    });

    this.dataService.filter = filterState;
    this.dataService.columns = columns;
  }

  public columnFiltersCleared(column: ControlColumn) {}

  public setFilterValues(columns: Column[]) {}

  public filterStateUpdated(filterState: FilterState): void {
    console.log('filter State updated handler');
    console.log(filterState);
  }
}
