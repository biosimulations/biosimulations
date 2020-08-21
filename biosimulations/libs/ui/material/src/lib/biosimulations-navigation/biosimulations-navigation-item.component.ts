import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-navigation-item',
  templateUrl: './biosimulations-navigation-item.component.html',
  styleUrls: ['./biosimulations-navigation-item.component.scss'],
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
  disabled: boolean = false;

  constructor() {}
}
