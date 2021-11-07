import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-home-teaser-button',
  templateUrl: './home-teaser-button.component.html',
  styleUrls: ['./home-teaser-button.component.scss'],
})
export class HomeTeaserButtonComponent {
  @Input()
  route!: any;

  @Input()
  href!: string;

  @Input()
  width = '156px';

  @Input()
  height = '104px';

  @Input()
  color = 'primary';

  @Input()
  disabled = false;
}
