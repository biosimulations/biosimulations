import { Component } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'biosimulations-hover-open-menu',
  templateUrl: './hover-open-menu.component.html',
  styleUrls: ['./hover-open-menu.component.scss'],
})
export class HoverOpenMenuComponent {
  timedOutCloser: any = null;

  openMenu(trigger: MatMenuTrigger): void {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }
    trigger.openMenu();
  }

  closeMenu(trigger: MatMenuTrigger): void {
    this.timedOutCloser = window.setTimeout(() => {
      trigger.closeMenu();
    }, 50);
  }
}
