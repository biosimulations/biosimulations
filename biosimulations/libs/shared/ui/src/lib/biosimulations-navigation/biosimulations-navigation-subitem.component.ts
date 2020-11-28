import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

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
  icon = '';

  @Input()
  route = '';

  @Input()
  disabled = false;
}
