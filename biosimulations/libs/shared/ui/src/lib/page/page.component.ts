import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  @Input()
  heading = '';

  @Input()
  padded = true;

  @Input()
  maxWidth?: string;
}
