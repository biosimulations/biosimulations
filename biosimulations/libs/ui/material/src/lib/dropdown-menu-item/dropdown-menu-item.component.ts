import {
  Component,
  Input,
} from '@angular/core';

@Component({
  selector: 'biosimulations-dropdown-menu-item',
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.scss'],
})
export class DropdownMenuItemComponent {
  @Input()
  title = '';

  @Input()
  icon = '';

  @Input()
  disabled = false;

  constructor() { }
}
