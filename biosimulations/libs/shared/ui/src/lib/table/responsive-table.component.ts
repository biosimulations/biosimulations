import { Component, Input } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Column, ColumnSort } from './table.interface';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'biosimulations-responsive-table',
  templateUrl: './responsive-table.component.html',
  styleUrls: ['./responsive-table.component.scss'],
})
export class ResponsiveTableComponent {
  @Input()
  linesPerRow = 1;

  @Input()
  columns: Column[] = [];

  @Input()
  stackedContentsHeading!: string;

  @Input()
  getStackedHeading!: (row: any) => string | Observable<string>;

  @Input()
  getStackedHeadingMoreInfoRouterLink!: (row: any) => any[] | string | null;

  @Input()
  getStackedHeadingMoreInfoHref!: (row: any) => string | null;

  @Input()
  singleLineHeadings = false;

  @Input()
  highlightRow!: (row: any) => boolean;

  @Input()
  sortable = true;

  @Input()
  defaultSort!: ColumnSort;

  @Input()
  controls = true;

  @Input()
  searchPlaceHolder!: string;

  @Input()
  searchToolTip!: string;

  @Input()
  data: Observable<any[]> = of([]);

  private showTable = new BehaviorSubject<boolean>(true);
  showTable$ = this.showTable.asObservable();

  constructor(breakpointObserver: BreakpointObserver) {
    this.showTable.next(!breakpointObserver.isMatched('(max-width: 959px)'));
    breakpointObserver.observe(['(max-width: 959px)']).subscribe((result) => {
      this.showTable.next(!result.matches);
    });
  }
}
