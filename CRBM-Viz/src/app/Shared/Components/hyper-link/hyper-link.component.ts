import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hyper-link',
  templateUrl: './hyper-link.component.html',
  styleUrls: ['./hyper-link.component.sass']
})
export class HyperLinkComponent {
  @Input() href: string;

  constructor() { }
}
