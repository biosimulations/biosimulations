import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { BiosimulationsIcon } from '@biosimulations/shared/icons';

@Component({
  selector: 'biosimulations-navigation-subitem',
  templateUrl: './biosimulations-navigation-subitem.component.html',
  styleUrls: ['./biosimulations-navigation-subitem.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiosimulationsNavigationSubitemComponent {
  @Input()
  heading = '';

  @Input()
  icon!: BiosimulationsIcon;

  @Input()
  route: string | string[] = '';

  @Input()
  queryParams: { [key: string]: string } = {};

  @Input()
  disabled = false;
}
