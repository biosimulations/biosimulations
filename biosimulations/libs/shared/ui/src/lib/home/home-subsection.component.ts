import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-home-subsection',
  templateUrl: './home-subsection.component.html',
  styleUrls: ['./home-subsection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeSubsectionComponent {
  @Input()
  title = '';

  @Input()
  subtitle = '';

  @Input()
  subtitleSize = 'large';

  @Input()
  icon = '';

  constructor() {}
}
