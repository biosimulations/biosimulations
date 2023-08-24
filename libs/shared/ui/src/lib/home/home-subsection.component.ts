import { Component, Input } from '@angular/core';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';

@Component({
  selector: 'biosimulations-home-subsection',
  templateUrl: './home-subsection.component.html',
  styleUrls: ['./home-subsection.component.scss'],
})
export class HomeSubsectionComponent {
  @Input()
  heading = '';

  @Input()
  subheading = '';

  @Input()
  subheadingSize = 'large';

  @Input()
  icon!: BiosimulationsIcon;

  @Input()
  link?: string;

  @Input()
  iconColor? = '#ffa500';

  @Input()
  hrefHeader = false;
}
