import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

import { BiosimulationsIcon } from '@biosimulations/shared/icons';
@Component({
  selector: 'biosimulations-topbar-menu-item',
  templateUrl: './topbar-menu-item.component.html',
  styleUrls: ['./topbar-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopbarMenuItemComponent {
  @Input()
  heading = '';

  @Input()
  icon!: BiosimulationsIcon;

  @Input()
  route: string | string[] = '';

  @Input()
  disabled = false;

  constructor() {}
}
