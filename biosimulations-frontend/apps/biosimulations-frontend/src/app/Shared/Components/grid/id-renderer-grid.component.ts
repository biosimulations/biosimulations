import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  templateUrl: './id-renderer-grid.component.html',
  styleUrls: ['./id-renderer-grid.component.sass'],
})
export class IdRendererGridComponent implements ICellRendererAngularComp {
  id;
  icon;

  agInit(params: any): void {
    this.refresh(params);
  }

  refresh(params: any): boolean {
    this.id = params.data.id;
    this.icon = params.data.getIcon();
    return true;
  }
}