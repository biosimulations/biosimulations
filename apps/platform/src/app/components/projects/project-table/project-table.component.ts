import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BrowseService } from './browse.service';
import { FormattedProjectSummary, FormattedProjectSummaryQueryResults } from './browse.model';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SearchCriteria } from '@biosimulations/angular-api-client';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { MatTable } from '@angular/material/table';
import { ProjectFilterQueryItem, ProjectFilterStatsItem } from '@biosimulations/datamodel/common';

export class ProjectTableDataSource extends DataSource<FormattedProjectSummary> {
  public paginator: MatPaginator | undefined;
  public sort: MatSort | undefined;
  private _destroying$: Subject<void> = new Subject<void>();

  private searchCriteria$ = new BehaviorSubject(new SearchCriteria());
  private searchCriteria = new SearchCriteria();

  public filterQueryItems$ = new BehaviorSubject<ProjectFilterQueryItem[]>([]);
  private filterQueryItems: ProjectFilterQueryItem[] = [];

  private formattedProjectSummaryQueryResults$: Observable<FormattedProjectSummaryQueryResults>;
  private formattedProjectSummaries$ = new BehaviorSubject<FormattedProjectSummary[]>([]);

  public datalength = 0;
  public searchTermChange?: EventEmitter<string>;
  private projectTableComponent!: ProjectTableComponent;

  constructor(private browseService: BrowseService, projectTableComponent: ProjectTableComponent) {
    super();

    this.projectTableComponent = projectTableComponent;

    // on each
    this.formattedProjectSummaryQueryResults$ = this.searchCriteria$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      takeUntil(this._destroying$),
      switchMap((criteria) => {
        const filterDesc: string | undefined = criteria.filters
          ?.map((item) => item.target.toString() + '=[' + item.allowable_values.join(',') + ']')
          .join(', ');
        console.log(
          `fetching results with SearchCriteria: filter=${filterDesc}, search=${criteria.searchText}, pageIndex=${criteria.pageIndex}, pageSize=${criteria.pageSize}`,
        );
        return this.browseService.getProjects(criteria);
      }),
    );

    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    this.formattedProjectSummaryQueryResults$.subscribe((results) => {
      this.datalength = results.numMatchingProjectSummaries;
      this.formattedProjectSummaries$.next(results.formattedProjectSummaries);
      this.projectTableComponent.filterStats$.next(results.queryStats);
    });
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<FormattedProjectSummary[]> {
    if (this.paginator && this.sort && this.searchTermChange) {
      // emit a new searchCriteria upon each Search Term event
      this.searchTermChange.subscribe((stringEvent) => {
        this.searchCriteria = { ...this.searchCriteria, searchText: stringEvent };
        this.searchCriteria$.next(this.searchCriteria);
        this.paginator?.firstPage();
      });

      // emit a new searchCriteria upon each Pagination event
      this.paginator.page.subscribe((pageEvent) => {
        this.searchCriteria = { ...this.searchCriteria, pageSize: pageEvent.pageSize, pageIndex: pageEvent.pageIndex };
        this.searchCriteria$.next(this.searchCriteria);
      });

      // emit a new searchCriteria upon each Sort event
      this.sort.sortChange.subscribe((sortEvent) => {
        this.searchCriteria = {
          ...this.searchCriteria,
          sortActive: sortEvent.active,
          sortDirection: sortEvent.direction,
        };
        this.searchCriteria$.next(this.searchCriteria);
      });

      // emit a new searchCriteria upon each Filter change event
      this.filterQueryItems$.subscribe((filterQueryItems) => {
        this.searchCriteria = { ...this.searchCriteria, filters: filterQueryItems };
        this.searchCriteria$.next(this.searchCriteria);
        this.paginator?.firstPage();
      });

      return this.formattedProjectSummaries$;
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
    this._destroying$.next();
    this._destroying$.complete();
  }
}

@Component({
  selector: 'biosimulations-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss'],
})
export class ProjectTableComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<FormattedProjectSummary>;
  dataSource: ProjectTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  public displayedColumns = ['id', 'title'];
  @Input() searchTerm = '';
  @Output() searchTermChange: EventEmitter<string> = new EventEmitter<string>();

  @Output() filterStats$ = new BehaviorSubject([] as ProjectFilterStatsItem[]);

  constructor(browseService: BrowseService) {
    this.dataSource = new ProjectTableDataSource(browseService, this);
  }

  public onKeyUpEvent(event: KeyboardEvent) {
    this.searchTermChange.next(this.searchTerm);
  }

  public onFilterQueryChanged(filterQueryItems: ProjectFilterQueryItem[]): void {
    const filterDesc: string = filterQueryItems
      .map((item) => item.target.toString() + '=[' + item.allowable_values.join(',') + ']')
      .join(', ');
    console.log(`onFilterQueryChanged() called with ${filterDesc}`);
    this.dataSource.filterQueryItems$.next(filterQueryItems);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.dataSource.searchTermChange = this.searchTermChange;
  }
}
