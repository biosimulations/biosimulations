import { Component, Input } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'biosimulations-hover-open-menu',
  templateUrl: './hover-open-menu.component.html',
  styleUrls: ['./hover-open-menu.component.scss'],
})
export class HoverOpenMenuComponent {
  @Input()
  public disabled = false;

  @Input()
  public href?: string;

  @Input()
  public target = '_self';

  public timedOutCloser = 300;

  public openMenu(trigger: MatMenuTrigger): void {
    if (!this.disabled) {
      if (this.timedOutCloser) {
        clearTimeout(this.timedOutCloser);
      }
      trigger.openMenu();
    }
  }

  public closeMenu(trigger: MatMenuTrigger): void {
    if (!this.disabled) {
      this.timedOutCloser = window.setTimeout(() => {
        trigger.closeMenu();
      }, 30);
    }
  }

  public navigate(trigger: MatMenuTrigger, targetValue?: string): void {
    if (!targetValue) {
      targetValue = this.target;
    }
    if (this.href) {
      window.open(this.href, targetValue);
    }
    trigger.closeMenu();
  }

  public stayStatic(trigger: MatMenuTrigger): void {
    return trigger.closeMenu();
  }
}
