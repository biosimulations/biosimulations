import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-navigation-subitem',
  templateUrl: './biosimulations-navigation-subitem.component.html',
  styleUrls: ['./biosimulations-navigation-subitem.component.scss'],
})
export class BiosimulationsNavigationSubitemComponent {
  @Input()
  title = '';

  @Input()
  icon = '';

  @Input()
  route = '';

  @Input()
  disabled = false;

  constructor() {}
}
