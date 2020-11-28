import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-home-logo',
  templateUrl: './home-logo.component.html',
  styleUrls: ['./home-logo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLogoComponent {
  @Input()
  title = '';

  @Input()
  src = '';

  @Input()
  href = '';
}
