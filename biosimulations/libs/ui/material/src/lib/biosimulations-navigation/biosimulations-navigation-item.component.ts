import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-navigation-item',
  templateUrl: './biosimulations-navigation-item.component.html',
  styleUrls: ['./biosimulations-navigation-item.component.scss'],
})
export class BiosimulationsNavigationItemComponent {
  @Input()
  title: string = '';

  @Input()
  icon: string = '';

  @Input()
  route: string = '';

  @Input()
  aboveDivider: boolean = false;

  constructor() {}
}
