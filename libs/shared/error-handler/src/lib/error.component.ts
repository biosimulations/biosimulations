import { Component, Input } from '@angular/core';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';

@Component({
  selector: 'biosimulations-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  @Input()
  icon!: BiosimulationsIcon;

  @Input()
  code!: number | string;

  @Input()
  pageHasBreadCrumbs = false;
}
