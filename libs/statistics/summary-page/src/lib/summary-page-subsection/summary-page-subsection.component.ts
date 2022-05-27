import { Component, Input } from '@angular/core';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';

@Component({
  selector: 'biosimulations-summary-page-subsection',
  templateUrl: './summary-page-subsection.component.html',
  styleUrls: ['./summary-page-subsection.component.scss'],
})
export class SummaryPageSubsectionComponent {
  @Input()
  public heading = '';

  @Input()
  public subheading = '';

  @Input()
  public subheadingSize = 'large';

  @Input()
  public icon!: BiosimulationsIcon;
}
