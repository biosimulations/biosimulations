import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {IToolPanel, IToolPanelParams} from 'ag-grid-community';

@Component({
    templateUrl: './search-tool-panel.component.html',
    styleUrls: ['./search-tool-panel.component.sass'],
})
export class SearchToolPanelComponent implements IToolPanel{
    private gridApi;

    agInit(params: IToolPanelParams): void {
        this.gridApi = params.api;
    }

    refresh(): void {}

    search(input) {
        this.gridApi.setQuickFilter(input.value);
    }
}
