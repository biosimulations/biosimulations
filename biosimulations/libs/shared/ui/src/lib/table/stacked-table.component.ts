import { Component, Input, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Column, ColumnLinkType, Sort, Side, RowService } from './table.interface';
import { TocSection } from '../toc/toc-section';
import { TocSectionsContainerDirective } from '../toc/toc-sections-container.directive';

@Component({
  selector: 'biosimulations-stacked-table',
  templateUrl: './stacked-table.component.html',
  styleUrls: ['./stacked-table.component.scss'],
})
export class StackedTableComponent {
  @Input()
  contentsHeading!: string;

  private _columns!: Column[];
  displayedColumns!: Column[];

  @Input()
  set columns (columns: Column[]) {
    this._columns = columns;
    this.displayedColumns = columns.filter((column: Column) => column.showStacked !== false);
    this.updateDerivedData();
    this.derivedData.next(this._derivedData);
  }

  @Input()
  getHeading!: (row: any) => string;

  @Input()
  getHeadingMoreInfoRouterLink!: (row: any) => any[] | string | null;

  @Input()
  getHeadingMoreInfoHref!: (row: any) => string | null;

  @Input()
  defaultSort!: Sort;

  private _data!: Observable<any[]>;
  private _dataValue!: any[];
  private _derivedData: any[] = [];
  private derivedData = new BehaviorSubject<any[]>([]);
  derivedData$ = this.derivedData.asObservable();

  @Input()
  set data(data: Observable<any[]>) {
    this._data = data;
    this.data.subscribe((data: any[]) => {
      this._derivedData = [];

      data.forEach((datum: any, index:number) => {
        const derivedDatum: any = {};
        this._derivedData.push(derivedDatum);

        derivedDatum['heading'] = this.getHeading(datum);

        if (this.getHeadingMoreInfoRouterLink !== undefined) {
          derivedDatum['icon'] = 'internalLink';
          derivedDatum['iconAction'] = this.getHeadingMoreInfoRouterLink(datum);
        } else if (this.getHeadingMoreInfoHref !== undefined) {
          derivedDatum['icon'] = 'link';
          derivedDatum['iconAction'] = this.getHeadingMoreInfoHref(datum);
        } else {
          derivedDatum['icon'] = 'toTop';
          derivedDatum['iconAction'] = null;
        }

        derivedDatum['columns'] = {}
      });

      this._dataValue = data;
      this.updateDerivedData();

      this.derivedData.next(this._derivedData);
    });
  }

  get data(): Observable<any[]> {
    return this._data;
  }

  updateDerivedData(): void {
    if (this._dataValue === undefined || this.displayedColumns === undefined) {
      return;
    }

    this._dataValue.forEach((datum: any, index:number) => {
      const derivedDatum = this._derivedData[index]['columns'];

      this.displayedColumns.forEach((column: Column) => {
        derivedDatum[column.id] = {};

        derivedDatum[column.id]['value'] = RowService.formatElementValue(RowService.getElementValue(datum, column), column, true);

        if (column.centerLinkType === ColumnLinkType.routerLink) {
          derivedDatum[column.id]['centerRouterLink'] = RowService.getElementRouterLink(datum, column, Side.center);
        } else if (column.centerLinkType === ColumnLinkType.href) {
          derivedDatum[column.id]['centerHef'] = RowService.getElementHref(datum, column, Side.center);
        }
      });
    });
  }

  RowService = RowService;

  tocSections!: TocSection[];

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {this.tocSections = container.sections;});
  }
}
