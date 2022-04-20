import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';
import { TableComponent } from '../table/table.component';
import { ColumnSortDirection } from '../table/table.interface';

@Component({
  selector: 'biosimulations-table-strangler',
  templateUrl: './table-strangler.component.html',
  styleUrls: ['./table-strangler.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableStranglerComponent {
  @Input()
  table!: TableComponent;
  @Input()
  openControlPanelId = 1;
  @Input()
  attributesHeading = 'Columns';

  @Input()
  searchPlaceHolder!: string;

  @Input()
  searchToolTip!: string;

  @Input()
  closeable = false;
}
