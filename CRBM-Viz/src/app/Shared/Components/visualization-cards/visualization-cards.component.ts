import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Visualization } from '../../Models/visualization';

@Component({
  selector: 'app-visualization-cards',
  templateUrl: './visualization-cards.component.html',
  styleUrls: ['./visualization-cards.component.sass']
})
export class VisualizationCardsComponent {
  @Input() visualizations: Visualization[];
  @Input() maxVisualizations = Infinity;
  @Input() cols = 2;

  constructor(private router: Router) { }
}
