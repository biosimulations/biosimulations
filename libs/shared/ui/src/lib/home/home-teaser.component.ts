import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-home-teaser',
  templateUrl: './home-teaser.component.html',
  styleUrls: ['./home-teaser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeTeaserComponent {
  @Input()
  heading = '';

  @Input()
  banner = '';
}
