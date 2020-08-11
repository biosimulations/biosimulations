import { Component } from '@angular/core';

@Component({
  selector: 'biosimulations-hover-open-menu',
  templateUrl: './hover-open-menu.component.html',
  styleUrls: ['./hover-open-menu.component.scss'],
})
export class HoverOpenMenuComponent {
  timedOutCloser: any = null;

  constructor() { }

  openMenu(trigger: any) {
    if (this.timedOutCloser) {
      clearTimeout(this.timedOutCloser);
    }
    trigger.openMenu();
  }

  closeMenu(trigger: any) {
    this.timedOutCloser = window.setTimeout(() => {
      trigger.closeMenu();
    }, 50);
  }
}
