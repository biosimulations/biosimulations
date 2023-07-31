import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  @Input()
  public useBioSimulationsColor? = true;

  public biosimulationsColor = '#2196f3';

  public biosimulatorsColor = '#ff9800';

  @Input()
  public color = this.useBioSimulationsColor ? this.biosimulationsColor : this.biosimulatorsColor;

  @Input()
  public showLogo = true;

  @Input()
  public target = '_self';

  @Input()
  public simulations = true;
}
