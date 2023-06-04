import { Component, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'biosimulations-hover-open-menu',
  templateUrl: './hover-open-menu.component.html',
  styleUrls: ['./hover-open-menu.component.scss'],
})
export class HoverOpenMenuComponent {
  @Input()
  link?: string;

  @Input()
  target: string | undefined;

  timedOutCloser: any = null;

  @Input()
  disabled: any = false;

  openMenu(trigger: MatMenuTrigger): void {
    if (!this.disabled) {
      if (this.timedOutCloser) {
        clearTimeout(this.timedOutCloser);
      }
      trigger.openMenu();
    }
  }

  closeMenu(trigger: MatMenuTrigger): void {
    if (!this.disabled) {
      this.timedOutCloser = window.setTimeout(() => {
        trigger.closeMenu();
      }, 50);
    }
  }

  navigate() {
    if (this.link) {
      //window.location.href = this.link;
      window.open(this.link, '_blank');
    }
  }
}
