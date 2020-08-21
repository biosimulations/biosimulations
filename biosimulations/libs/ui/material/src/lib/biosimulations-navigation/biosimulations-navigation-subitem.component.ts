import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-navigation-subitem',
  templateUrl: './biosimulations-navigation-subitem.component.html',
  styleUrls: ['./biosimulations-navigation-subitem.component.scss'],
})
export class BiosimulationsNavigationSubitemComponent {
  @Input()
  title: string = '';

  @Input()
  icon: string = '';

  @Input()
  route: string = '';

  @Input()
  disabled: boolean = false;

  constructor() {}
}
