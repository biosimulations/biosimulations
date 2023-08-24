import { Component, Input } from '@angular/core';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';

@Component({
  selector: 'biosimulations-home-subsection',
  templateUrl: './home-subsection.component.html',
  styleUrls: ['./home-subsection.component.scss'],
})
export class HomeSubsectionComponent {
  @Input()
  public heading = '';

  @Input()
  public subheading = '';

  @Input()
  public subheadingSize = 'large';

  @Input()
  public icon!: BiosimulationsIcon;

  @Input()
  public link?: string;

  @Input()
  public iconColor? = '#ffa500';

  @Input()
  public hrefHeader = false;
}
