import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hyperlink',
  templateUrl: './hyperlink.component.html',
  styleUrls: ['./hyperlink.component.sass']
})
export class HyperlinkComponent {
  @Input() href: string;

  constructor() { }
}
