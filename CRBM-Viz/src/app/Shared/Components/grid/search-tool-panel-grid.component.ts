import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {IToolPanel, IToolPanelParams} from 'ag-grid-community';

@Component({
    templateUrl: './search-tool-panel-grid.component.html',
    styleUrls: ['./search-tool-panel-grid.component.sass'],
})
export class SearchToolPanelGridComponent implements IToolPanel{
    private gridApi;

    agInit(params: IToolPanelParams): void {
        this.gridApi = params.api;
    }

    refresh(): void {}

    search(input) {
        this.gridApi.setQuickFilter(input.value);
    }
}
