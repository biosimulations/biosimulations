import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import 'ag-grid-enterprise';
import { IdRendererGridComponent } from './id-renderer-grid.component';
import { IdRouteRendererGridComponent } from './id-route-renderer-grid.component';
import { RouteRendererGridComponent } from './route-renderer-grid.component';
import { SearchToolPanelGridComponent } from './search-tool-panel-grid.component';

enum View {
  icons = 'icons',
  details = 'details',
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.sass'],
})
export class GridComponent {
  @Input() rowTypePlural: string;
  @Input() columnDefs: object;
  @Input() rowData;

  private _selectable: string = null;
  @Input()
  set selectable(value: string) {
    this._selectable = value;
    if (this.defaultColDef) {
      if (value) {
        this.defaultColDef['cellRenderer'] = null;
      } else {
        this.defaultColDef['cellRenderer'] = 'routerRenderer';
      }
    }
  }
  get selectable(): string {
    return this._selectable;
  }

  selected: Set<object> = new Set();

  @Output() selectRow = new EventEmitter();

  @Input() inTab = false;

  filteredRowData: object[];

  view: View = View.icons;
  View = View;

  private gridApi;

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
    idRouteRenderer: IdRouteRendererGridComponent,
    routerRenderer: RouteRendererGridComponent,
    searchToolPanel: SearchToolPanelGridComponent,
  }

  defaultColDef = {
      filter: 'agTextColumnFilter',
      cellRenderer: (this._selectable ? null : 'routerRenderer'),
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
  suppressHorizontalScroll = true;

  constructor(private el: ElementRef) {}

  onGridReady(event) {
    this.gridApi = event.api;
    const gridApi = this.gridApi;

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

    const displayedCols = columnApi.getAllDisplayedColumns();
    const numDisplayedCols: number = displayedCols.length;
    let totDisplayedColWidth = 0;
    let totDisplayedColMinWidth = 0;
    for (const col of displayedCols) {
      totDisplayedColWidth += Math.max(col.width, col.minWidth);
      totDisplayedColMinWidth += col.minWidth;
    }

    if (totDisplayedColMinWidth + 2 * (numDisplayedCols + 1) > gridWidth) {
      this.suppressHorizontalScroll = false;
    } else {
      this.suppressHorizontalScroll = true;
    }

    gridApi.sizeColumnsToFit();
  }

  toggleToolPanel(event) {
    const gridApi = event.api;
    this.isToolPanelOpen = gridApi.isToolPanelShowing();
    this.sizeColumnsToFit(event);
  }


  updateFilteredRowData(event): void {
    const gridApi = event.api;

    this.filteredRowData = [];
    gridApi.forEachNodeAfterFilter((rowNode, index) => {
      this.filteredRowData.push(rowNode.data);
    });
  }

  toggleView(): void {
    if (this.view === View.icons) {
      this.view = View.details;
    } else {
      this.view = View.icons;
    }
  }

  rowSelected(event): void {
    if (event.node.selected) {
      event.data['_selected'] = true;
      this.selected.add(event.data);
    } else {
      event.data['_selected'] = false;
      this.selected.delete(event.data);
    }
  }

  toggleSelection(rowDatum): void {
    if ('_selected' in rowDatum && rowDatum['_selected']) {
      rowDatum['_selected'] = false;
      this.selected.delete(rowDatum);
      this.gridApi.getRowNode(rowDatum['id']).setSelected(false, false);
      this.selectRow.emit({data: rowDatum, selected: false});
    } else {
      if (this._selectable === 'single') {
        for (const rowDatum2 of this.selected) {
          rowDatum2['_selected'] = false;
        }
        this.selected.clear();
      }
      rowDatum['_selected'] = true;
      this.selected.add(rowDatum);
      this.gridApi.getRowNode(rowDatum['id']).setSelected(true, false);
      this.selectRow.emit({data: rowDatum, selected: true});
    }
  }

  getRowNodeId(rowData: object): string | number {
    return rowData['id'];
  }
}
