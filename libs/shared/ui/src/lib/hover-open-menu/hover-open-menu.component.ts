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
  public target = '_self';

  public timedOutCloser?: number;

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

  public navigate(targetValue?: string): void {
    if (!targetValue) {
      targetValue = this.target;
    }
    if (this.link) {
      //window.location.href = this.link;
      window.open(this.link, targetValue);
    }
  }

  public stayStatic(trigger: MatMenuTrigger): void {
    return trigger.closeMenu();
  }

  public linkClicked(trigger: MatMenuTrigger): void {
    this.disabled = true;
    this.disappearContainer(this.disabled, trigger);
  }

  private disappearContainer(disabled: boolean, trigger: MatMenuTrigger): void {
    if (disabled) {
      trigger.closeMenu();
    }
  }
}
