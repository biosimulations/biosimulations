import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input()
  public showLogo = true;

  @Input()
  color = 'primary';
}
