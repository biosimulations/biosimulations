import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-home-teaser',
  templateUrl: './home-teaser.component.html',
  styleUrls: ['./home-teaser.component.scss'],
})
export class HomeTeaserComponent {
  @Input()
  heading = '';

  @Input()
  banner = '';
}
