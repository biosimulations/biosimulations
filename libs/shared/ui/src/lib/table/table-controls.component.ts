import { Component, Input } from '@angular/core';
import { TableComponent } from './table.component';

@Component({
  selector: 'biosimulations-table-controls',
  templateUrl: './table-controls.component.html',
  styleUrls: ['./table-controls.component.scss'],
})
export class TableControlsComponent {
  @Input()
  table!: TableComponent;

  @Input()
  attributesHeading = 'Columns';

  @Input()
  searchPlaceHolder!: string;

  @Input()
  searchToolTip!: string;

  @Input()
  closeable = false;
}
