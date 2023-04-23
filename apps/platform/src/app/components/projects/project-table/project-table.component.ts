import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { BrowseService } from './browse.service';
import { FormattedProjectSummary, FormattedProjectSummaryQueryResults } from './browse.model';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SearchCriteria } from '@biosimulations/angular-api-client';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

export class ProjectTableDataSource extends DataSource<FormattedProjectSummary> {
  public paginator: MatPaginator | undefined;
  public sort: MatSort | undefined;
  private _destroying$: Subject<void> = new Subject<void>();

  private searchCriteria$ = new BehaviorSubject(new SearchCriteria());
  private searchCriteria = new SearchCriteria();

  private formattedProjectSummaryQueryResults$: Observable<FormattedProjectSummaryQueryResults>;
  private formattedProjectSummaries$ = new BehaviorSubject<FormattedProjectSummary[]>([]);

  public datalength = 0;
  public searchTermChange?: EventEmitter<string>;

  constructor(private browseService: BrowseService) {
    super();

    // on each
    this.formattedProjectSummaryQueryResults$ = this.searchCriteria$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      takeUntil(this._destroying$),
      switchMap((criteria) => {
        return this.browseService.getProjects(criteria);
      }),
    );

    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    this.formattedProjectSummaryQueryResults$.subscribe((results) => {
      this.datalength = results.numMatchingProjectSummaries;
      this.formattedProjectSummaries$.next(results.formattedProjectSummaries);
    });
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<FormattedProjectSummary[]> {
    if (this.paginator && this.sort && this.searchTermChange) {
      // emit a new searchCriteria upon each Pagination event
      this.searchTermChange.subscribe((stringEvent) => {
        this.searchCriteria = { ...this.searchCriteria, searchText: stringEvent };
        this.searchCriteria$.next(this.searchCriteria);
        this.paginator?.firstPage();
      });

      // emit a new searchCriteria upon each Pagination event
      this.paginator.page.subscribe((pageEvent) => {
        this.searchCriteria = {
          ...this.searchCriteria,
          pageSize: pageEvent.pageSize,
          pageIndex: pageEvent.pageIndex,
        };
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

  constructor(browseService: BrowseService) {
    this.dataSource = new ProjectTableDataSource(browseService);
  }

  public onKeyUpEvent(event: KeyboardEvent) {
    this.searchTermChange.next(this.searchTerm);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
    this.dataSource.searchTermChange = this.searchTermChange;
  }
}
