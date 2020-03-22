import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {IToolPanel, IToolPanelParams} from 'ag-grid-community';

@Component({
  templateUrl: './sort-tool-panel-grid.component.html',
  styleUrls: ['./sort-tool-panel-grid.component.sass'],
})
export class SortToolPanelGridComponent implements IToolPanel{
  private gridApi;
  columnDefs: object[];

  agInit(params: IToolPanelParams): void {
    this.gridApi = params.api;
    this.gridApi.addEventListener('gridColumnsChanged', () => {
      this.columnDefs = [];
      for (const colDef of this.gridApi.columnController.columnDefs) {
        if (!('sortable' in colDef) || colDef['sortable']) {
          this.columnDefs.push(colDef);
        }
      };
      this.columnDefs = this.columnDefs.sort((a, b) => (a['headerName'] > b['headerName'] ? 1 : -1));
    });
  }

  refresh(): void {}

  sort(column, direction) {
    let model: object[];
    if (column) {
      model = [
        {colId: column, sort: direction},
      ];
    } else {
      model = [];
    }
    this.gridApi.setSortModel(model);
  }
}
