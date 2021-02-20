import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';

@Component({
  selector: 'biosimulations-home-subsection',
  templateUrl: './home-subsection.component.html',
  styleUrls: ['./home-subsection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
}
