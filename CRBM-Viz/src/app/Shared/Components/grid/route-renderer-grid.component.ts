import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  templateUrl: './route-renderer-grid.component.html',
  styleUrls: ['./route-renderer-grid.component.sass'],
})
export class RouteRendererGridComponent implements ICellRendererAngularComp {
  value;
  route;

  agInit(params: any): void {
    this.refresh(params);
  }

  refresh(params: any): boolean {
    this.value = params.value;
    this.route = params.data.getRoute();
    return true;
  }
}