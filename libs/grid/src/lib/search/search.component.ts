import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { distinctUntilChanged, Observable, Subject } from 'rxjs';

@Component({
  selector: 'biosimulations-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  viewProviders: [MatExpansionPanel],
})
export class SearchComponent implements OnInit {
  @Input()
  public searchPlaceHolder?: string;

  @Input()
  public searchToolTip?: string;

  @Input()
  public searchQuery?: string;

  @Input()
  public expanded = false;

  @Input()
  public disabled = false;

  @Output()
  public searchQueryUpdated = new EventEmitter<string>();

  @Output()
  public opened = new EventEmitter<void>();

  private searchTerm$: Subject<string | null> = new Subject();

  public get searchTerm(): Observable<string | null> {
    return this.searchTerm$.asObservable().pipe(distinctUntilChanged());
  }

  public handleSearchQueryChange(searchQuery?: string): void {
    this.searchTerm$.next(searchQuery || '');
    this.searchQueryUpdated.emit(searchQuery);
  }

  public passOpen(): void {
    this.opened.emit();
  }

  constructor() {}

  ngOnInit(): void {
    this.searchTerm$.next(this.searchQuery || '');
  }
}
