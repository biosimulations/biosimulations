import { Component, Input, ElementRef } from '@angular/core';
import 'ag-grid-enterprise';
import { IdRendererGridComponent } from './id-renderer-grid.component';
import { SearchToolPanelGridComponent } from './search-tool-panel-grid.component';


@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass'],
})
export class GridComponent {
  @Input() rowTypePlural;
  @Input() rowData;
  @Input() columnDefs;

  icons = {
    search: `<mat-icon
      aria-hidden="false"
      aria-label="Search icon"
      class="icon mat-icon material-icons search-tool-panel-grid-icon"
      role="img"
      >search</mat-icon>`,
  };

  frameworkComponents = {
    idRenderer: IdRendererGridComponent,
    searchToolPanel: SearchToolPanelGridComponent,
  }

  defaultColDef = {
      filter: 'agTextColumnFilter',
      sortable: true,
      resizable: false,
      suppressMenu: true,
  };

  // TODO: implement custom tool panel that displays number of matches to each facet
  // TODO: implement custom tool panel with inverted filtering behavior (facet selection is positive rather than negative)
  // TODO: connect values of filters to database
  sideBar = {
    toolPanels: [
      {
        id: 'search',
        labelDefault: 'Search',
        labelKey: 'searchToolPanel',
        iconKey: 'search',
        toolPanel: 'searchToolPanel',
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
        toolPanelParams: {
          suppressFilterSearch: true,
          suppressExpandAll: true,
        }
      },
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressRowGroups: true,
          suppressValues: true,
          suppressPivots: true,
          suppressPivotMode: true,
          suppressSideButtons: false,
          suppressColumnFilter: true,
          suppressColumnSelectAll: true,
          suppressColumnExpandAll: true,
        }
      }
    ],
    defaultToolPanel: 'search',
    hiddenByDefault: false,
  };

  statusBar = {
      statusPanels: [
          {
            key: 'counts',
            statusPanel: 'agTotalAndFilteredRowCountComponent',
            align: 'left',
          }
      ]
  };

  isToolPanelOpen;

  constructor(private el: ElementRef) {}

  onGridReady(event) {
    const gridApi = event.api;

    const toolPanel = gridApi.getToolPanelInstance('columns');
    toolPanel.allowDragging = false;

    const statusPanel = gridApi.getStatusPanel('counts');
    statusPanel.eLabel.innerHTML = this.rowTypePlural;
    statusPanel.textContent = this.rowTypePlural;
  }

  sizeColumnsToFit(event) {
    const gridApi = event.api;
    const columnApi = event.columnApi;
    const gridRoot = this.el.nativeElement.getElementsByClassName('ag-root')[0];
    const gridWidth: number = gridRoot.offsetWidth;
    const numCols: number = this.columnDefs.length;
    const minColWidth: number = (gridWidth - 2 * (numCols + 1)) / numCols;

    const displayedCols = columnApi.getAllDisplayedColumns();
    const numDisplayedCols: number = displayedCols.length;
    let totDisplayedColWidth = 0;
    for (const col of displayedCols) {
      totDisplayedColWidth += Math.max(minColWidth, col.width);
    }
    for (const col of displayedCols) {
      const colWidth = minColWidth + (
        (gridWidth - minColWidth * numDisplayedCols) /
        (totDisplayedColWidth - minColWidth * numDisplayedCols) *
        (Math.max(minColWidth, col.width) - minColWidth));
      columnApi.setColumnWidth(col, colWidth);
    }

    for (const col of columnApi.getAllColumns()) {
      col['minWidth'] = minColWidth;
    }

    gridApi.sizeColumnsToFit();
  }

  toggleToolPanel(event) {
    const gridApi = event.api;
    this.isToolPanelOpen = gridApi.isToolPanelShowing();
    this.sizeColumnsToFit(event);
  }
}
