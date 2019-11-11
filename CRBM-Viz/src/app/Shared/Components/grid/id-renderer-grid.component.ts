import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-id-renderer-grid',
  templateUrl: './id-renderer-grid.component.html',
  styleUrls: ['./id-renderer-grid.component.sass'],
})
export class IdRendererGridComponent implements ICellRendererAngularComp {
  id;
  
  agInit(params: any): void {
    this.id = params.data.id;
  }

  refresh(params: any): boolean {
    this.id = params.data.id;
    return true;
  }
}