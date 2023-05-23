import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input()
  color = '#2196f3';

  @Input()
  public showLogo = true;
}
