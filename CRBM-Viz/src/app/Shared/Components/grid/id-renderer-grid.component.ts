import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-id-renderer-grid',
  templateUrl: './id-renderer-grid.component.html',
  styleUrls: ['./id-renderer-grid.component.sass'],
})
export class IdRendererGridComponent implements ICellRendererAngularComp {
  id;
  icon;
  route;

  agInit(params: any): void {
    this.refresh(params);
  }

  refresh(params: any): boolean {
    this.id = params.data.id;
    this.icon = params.data.getIcon();
    this.route = params.data.getRoute();
    return true;
  }
}