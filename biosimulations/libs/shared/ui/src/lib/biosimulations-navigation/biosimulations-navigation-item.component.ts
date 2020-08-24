import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'biosimulations-navigation-item',
  templateUrl: './biosimulations-navigation-item.component.html',
  styleUrls: ['./biosimulations-navigation-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BiosimulationsNavigationItemComponent {
  @Input()
  title = '';

  @Input()
  icon = '';

  @Input()
  route = '';

  @Input()
  aboveDivider = false;

  @Input()
  noExpansion = false;

  @Input()
  disabled = false;

  constructor() {}
}
