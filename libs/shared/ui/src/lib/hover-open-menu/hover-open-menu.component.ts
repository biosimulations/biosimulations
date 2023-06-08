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
  public link?: string;

  @Input()
  public target: string | undefined;

  public timedOutCloser: any = null;

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

  public navigate(): void {
    if (this.link) {
      //window.location.href = this.link;
      window.open(this.link, '_blank');
    }
  }

  public stayStatic(trigger: MatMenuTrigger): void {
    return trigger.closeMenu();
  }
}
