import { Component, Input } from '@angular/core';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';

enum TargetValue {
  Blank = '_blank',
  Self = '_self',
  Parent = '_parent',
}

@Component({
  selector: 'biosimulations-dropdown-menu-item',
  templateUrl: './dropdown-menu-item.component.html',
  styleUrls: ['./dropdown-menu-item.component.scss'],
})
export class DropdownMenuItemComponent {
  @Input()
  heading = '';

  @Input()
  icon!: BiosimulationsIcon;

  @Input()
  disabled = false;

  @Input()
  href?: string;

  @Input()
  target?: string;
}
