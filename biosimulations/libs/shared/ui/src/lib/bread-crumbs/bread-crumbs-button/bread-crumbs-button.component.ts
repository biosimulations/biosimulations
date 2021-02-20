import { Component, Input } from '@angular/core';

import { BiosimulationsIcon } from '@biosimulations/shared/icons';

@Component({
  selector: 'biosimulations-bread-crumbs-button',
  templateUrl: './bread-crumbs-button.component.html',
  styleUrls: ['./bread-crumbs-button.component.scss'],
})
export class BreadCrumbsButtonComponent {
  @Input()
  label!: string;

  @Input()
  icon!: BiosimulationsIcon;

  @Input()
  route!: string | string[];
}
