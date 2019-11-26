import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.sass'],
})
export class DataTableComponent implements OnInit {
  private gridApi;
  private gridColumnApi;
  @Input() columnDefs;
  @Input() rowData;
  constructor() {}

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    params.api.sizeColumnsToFit();

    params.api.sizeColumnsToFit();
    // tslint:disable-next-line:only-arrow-functions
    window.addEventListener('resize', function() {
      // tslint:disable-next-line:only-arrow-functions
      setTimeout(function() {
        params.api.sizeColumnsToFit();
      });
    });
  }
  ngOnInit() {
    if (this.columnDefs == null) {
      this.columnDefs = [
        { headerName: 'Make', field: 'make', sortable: true, filter: true },
        { headerName: 'Model', field: 'model', sortable: true, filter: true },
        { headerName: 'Price', field: 'price', sortable: true, filter: true },
      ];
    }
    if (this.rowData == null) {
      this.rowData = [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 },
      ];
    }
  }
}
