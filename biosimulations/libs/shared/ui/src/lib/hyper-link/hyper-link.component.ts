import { Component, Input } from '@angular/core';

@Component({
  selector: 'biosimulations-hyper-link',
  templateUrl: './hyper-link.component.html',
  styleUrls: ['./hyper-link.component.scss'],
})
export class HyperLinkComponent {
  @Input() href!: string;
}
