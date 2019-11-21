import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class GridService {
  constructor () {}

  sizeColumnsToFit(gridComponent, elementRef, gridApi, columnApi) {
    const gridRoot = elementRef.nativeElement.getElementsByClassName('ag-root')[0];
    const gridWidth: number = gridRoot.offsetWidth;

    const displayedCols = columnApi.getAllDisplayedColumns();
    const numDisplayedCols: number = displayedCols.length;
    let totDisplayedColWidth = 0;
    let totDisplayedColMinWidth = 0;
    for (const col of displayedCols) {
      totDisplayedColWidth += Math.max(col.width, col.minWidth);
      totDisplayedColMinWidth += col.minWidth;
    }

    if (totDisplayedColMinWidth + 2 * (numDisplayedCols + 1) > gridWidth) {
      gridComponent.suppressHorizontalScroll = false;
    } else {
      gridComponent.suppressHorizontalScroll = true;
    }

    gridApi.sizeColumnsToFit();
  }
}
