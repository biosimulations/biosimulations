import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input()
  public biosimulators = false;

  @Input()
  public color?: string;

  @Input()
  public showLogo = true;

  @Input()
  public target = '_self';

  public constructor() {
    this.handleColor();
  }

  public handleColor(): void {
    if (this.biosimulators) {
      this.color = '#ff9800';
    } else {
      this.color = '#2196f3';
    }
  }
}
