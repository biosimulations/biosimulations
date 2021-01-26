import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

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
  icon = '';

  @Input()
  route = '';

  @Input()
  disabled = false;
}
