import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'biosimulations-dropdown-menu-item',
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownMenuItemComponent {
  @Input()
  heading = '';

  @Input()
  icon = '';

  @Input()
  disabled = false;
}
