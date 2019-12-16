import { Component, Input } from '@angular/core';
import { TopLevelResource } from 'src/app/Shared/Models/top-level-resource';

@Component({
  selector: 'app-grid-card',
  templateUrl: './grid-card.component.html',
  styleUrls: ['./grid-card.component.sass']
})
export class GridCardComponent {
  @Input() data: TopLevelResource;

  constructor() { }
}
