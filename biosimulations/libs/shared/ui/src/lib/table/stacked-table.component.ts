import { Component, Input, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { UtilsService } from '@biosimulations/shared/services';
import {
  Column,
  ColumnActionType,
  IdColumnMap,
  ColumnSort,
  Side,
  RowService,
} from './table.interface';
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
  private idToColumn!: IdColumnMap;

  @Input()
  set columns(columns: Column[]) {
    this._columns = columns;
    this.displayedColumns = columns.filter(
      (column: Column) => column.showStacked !== false
    );

    this.idToColumn = columns.reduce(
      (map: { [id: string]: Column }, col: Column) => {
        map[col.id] = col;
        return map;
      },
      {}
    );

    this.updateDerivedData();
    this.derivedData.next(this._derivedData);
  }

  @Input()
  getHeading!: (row: any) => (string | Observable<string>);

  @Input()
  getHeadingMoreInfoRouterLink!: (row: any) => any[] | string | null;

  @Input()
  getHeadingMoreInfoHref!: (row: any) => string | null;

  private _highlightRow!: (element: any) => boolean;

  @Input()
  set highlightRow(func: (element: any) => boolean) {
    this._highlightRow = func;
    this.setRowHighlighting();
    this.derivedData.next(this._derivedData);
  }

  @Input()
  defaultSort!: ColumnSort;

  private _dataValue!: any[];
  private _derivedData: any[] = [];
  private derivedData = new BehaviorSubject<any[]>([]);
  derivedData$ = this.derivedData.asObservable();

  @Input()
  set data(data: any) {
    if (data instanceof Observable) {
      data.subscribe((unresolvedData: any[]) => {
        UtilsService.recursiveForkJoin(unresolvedData)
          .subscribe((resolvedData: any[] | undefined) => {
            if (resolvedData !== undefined) {
              this.setData(resolvedData);
            }
          });
      });
    } else {
      UtilsService.recursiveForkJoin(data)
        .subscribe((resolvedData: any[] | undefined) => {
          if (resolvedData !== undefined) {
            this.setData(resolvedData);
          }
        });
    }
  }

  setData(data: any[]): void {
    this._derivedData = [];

    const sortedData = RowService.sortData(this.idToColumn, data, this.defaultSort);

    sortedData.forEach((datum: any, index: number) => {
      const derivedDatum: any = {};
      this._derivedData.push(derivedDatum);

      derivedDatum['heading'] = this.getHeading(datum);

      if (this.getHeadingMoreInfoRouterLink !== undefined) {
        derivedDatum['icon'] = 'more';
        derivedDatum['iconActionType'] = 'routerLink';
        derivedDatum['iconAction'] = this.getHeadingMoreInfoRouterLink(datum);
      } else if (this.getHeadingMoreInfoHref !== undefined) {
        derivedDatum['icon'] = 'link';
        derivedDatum['iconActionType'] = 'href';
        derivedDatum['iconAction'] = this.getHeadingMoreInfoHref(datum);
      } else {
        derivedDatum['icon'] = 'toTop';
        derivedDatum['iconActionType'] = 'scrollToTop';
        derivedDatum['iconAction'] = null;
      }

      derivedDatum['rawData'] = datum;
      derivedDatum['columns'] = {};
    });

    this._dataValue = sortedData;
    this.updateDerivedData();

    this.setRowHighlighting();

    this.derivedData.next(this._derivedData);
  }

  updateDerivedData(): void {
    if (this._dataValue === undefined || this.displayedColumns === undefined) {
      return;
    }

    this._dataValue.forEach((datum: any, index: number) => {
      const derivedDatum = this._derivedData[index]['columns'];

      this.displayedColumns.forEach((column: Column) => {
        derivedDatum[column.id] = {};

        derivedDatum[column.id]['value'] = RowService.formatElementValue(
          RowService.getElementValue(datum, column),
          column,
          true
        );

        if (column.centerAction === ColumnActionType.routerLink) {
          const tmp = RowService.getElementRouterLink(datum, column, Side.center);
          derivedDatum[column.id]['centerRouterLink'] = tmp.routerLink;
          derivedDatum[column.id]['centerFragment'] = tmp.fragment;

        } else if (column.centerAction === ColumnActionType.href) {
          derivedDatum[column.id]['centerHref'] = RowService.getElementHref(
            datum,
            column,
            Side.center
          );
        } else if (column.centerAction === ColumnActionType.click) {
          derivedDatum[column.id]['centerClick'] = RowService.getElementClick(
            column,
            Side.center
          );
        }

        if (column.rightAction === ColumnActionType.routerLink) {
          const tmp = RowService.getElementRouterLink(datum, column, Side.right);
          derivedDatum[column.id]['rightRouterLink'] = tmp.routerLink;
          derivedDatum[column.id]['rightFragment'] = tmp.fragment;

        } else if (column.rightAction === ColumnActionType.href) {
          derivedDatum[column.id]['rightHref'] = RowService.getElementHref(
            datum,
            column,
            Side.right
          );
        } else if (column.rightAction === ColumnActionType.click) {
          derivedDatum[column.id]['rightClick'] = RowService.getElementClick(
            column,
            Side.right
          );
        }
        derivedDatum[column.id]['rightIconTitle'] = RowService.getIconTitle(datum, column, Side.right);
      });
    });
  }

  setRowHighlighting() {
    this._derivedData.forEach((row: any): void => {
      if (this._highlightRow === undefined) {
        row['highlight'] = false;
      } else {
        row['highlight'] = this._highlightRow(row.rawData);
      }
    });
  }

  tocSections!: Observable<TocSection[]>;

  @ViewChild(TocSectionsContainerDirective)
  set tocSectionsContainer(container: TocSectionsContainerDirective) {
    setTimeout(() => {
      this.tocSections = container.sections$;
    });
  }

  isObservable(value: any): boolean {
    return value instanceof Observable;
  }
}
