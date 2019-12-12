import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid-card',
  templateUrl: './grid-card.component.html',
  styleUrls: ['./grid-card.component.sass']
})
export class GridCardComponent {
  @Input() data: object;

  constructor() { }
}
