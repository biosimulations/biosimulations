import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { BrowseService } from './browse.service';
import { FormattedProjectSummary } from './browse.model';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SearchCriteria } from '@biosimulations/angular-api-client';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

export class ProjectTableDataSource extends DataSource<FormattedProjectSummary> {
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;
  private _destroying$: Subject<void> = new Subject<void>();
  searchCriteriaSubject$: BehaviorSubject<SearchCriteria> = new BehaviorSubject(new SearchCriteria());
  searchCriteriaSubject: SearchCriteria = new SearchCriteria();
  public datalength = 400;
  public searchTermChange?: EventEmitter<string>;

  constructor(private browseService: BrowseService) {
    super();
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
        this.searchCriteriaSubject = { ...this.searchCriteriaSubject, searchText: stringEvent };
        this.searchCriteriaSubject$.next(this.searchCriteriaSubject);
      });

      // emit a new searchCriteria upon each Pagination event
      this.paginator.page.subscribe((pageEvent) => {
        this.searchCriteriaSubject = {
          ...this.searchCriteriaSubject,
          pageSize: pageEvent.pageSize,
          pageIndex: pageEvent.pageIndex,
        };
        this.searchCriteriaSubject$.next(this.searchCriteriaSubject);
      });

      // emit a new searchCriteria upon each Sort event
      this.sort.sortChange.subscribe((sortEvent) => {
        this.searchCriteriaSubject = {
          ...this.searchCriteriaSubject,
          sortActive: sortEvent.active,
          sortDirection: sortEvent.direction,
        };
        this.searchCriteriaSubject$.next(this.searchCriteriaSubject);
      });

      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return this.searchCriteriaSubject$.pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this._destroying$),
        switchMap((criteria) => {
          return this.browseService.getProjects(criteria);
        }),
      );
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
  styleUrls: ['./project-table.component.css'],
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
