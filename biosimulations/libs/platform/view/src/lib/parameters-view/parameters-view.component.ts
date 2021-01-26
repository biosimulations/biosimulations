import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'biosimulations-parameters-view',
  templateUrl: './parameters-view.component.html',
  styleUrls: ['./parameters-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParametersViewComponent {
  @Input()
  list: any;
  displayedColumns = [
    'id',
    'name',
    'group',
    'type',
    'value',
    'range',
    'units',
    'description',
  ];
}
