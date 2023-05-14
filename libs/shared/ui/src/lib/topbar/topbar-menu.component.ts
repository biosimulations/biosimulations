import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-topbar-menu',
  templateUrl: './topbar-menu.component.html',
  styleUrls: ['./topbar-menu.component.scss'],
})
export class TopbarMenuComponent {
  @Input()
  color = 'primary';
}
