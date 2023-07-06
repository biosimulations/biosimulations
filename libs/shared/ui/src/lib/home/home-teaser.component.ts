import { Component, Input } from '@angular/core';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';

@Component({
  selector: 'biosimulations-home-teaser',
  templateUrl: './home-teaser.component.html',
  styleUrls: ['./home-teaser.component.scss'],
})
export class HomeTeaserComponent {
  @Input() public heading = '';
  public portalUrl = 'https://reproducibilityportal.org';
  public tipIcon?: BiosimulationsIcon;
}
