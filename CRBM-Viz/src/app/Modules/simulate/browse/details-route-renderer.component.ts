import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  templateUrl: './details-route-renderer.component.html',
  styleUrls: ['./details-route-renderer.component.sass'],
})
export class DetailsRouteRendererComponent implements ICellRendererAngularComp {
  private id;
  
  agInit(params: any): void {
    this.id = params.data.id;
  }

  refresh(params: any): boolean {
    this.id = params.data.id;
    return true;
  }
}