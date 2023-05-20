import { Component, Input } from '@angular/core';

import { BiosimulationsIcon } from '@biosimulations/shared/icons';
@Component({
  selector: 'biosimulations-topbar-menu-item',
  templateUrl: './topbar-menu-item.component.html',
  styleUrls: ['./topbar-menu-item.component.scss'],
})
export class TopbarMenuItemComponent {
  @Input()
  color!: any;
  @Input()
  heading = '';

  @Input()
  icon!: BiosimulationsIcon;

  @Input()
  route: string | string[] = '';

  @Input()
  queryParams: { [key: string]: string } = {};

  @Input()
  href = '';

  @Input()
  target = '_blank';

  @Input()
  disabled = false;

  constructor() {}
}
