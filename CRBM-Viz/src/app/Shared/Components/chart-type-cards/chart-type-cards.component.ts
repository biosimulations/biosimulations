import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ChartType } from '../../Models/chart-type';

@Component({
  selector: 'app-chart-type-cards',
  templateUrl: './chart-type-cards.component.html',
  styleUrls: ['./chart-type-cards.component.sass']
})
export class ChartTypeCardsComponent {
  @Input() chartTypes: ChartType[];
  @Input() maxChartTypes = Infinity;
  @Input() cols = 2;

  constructor(private router: Router) { }
}
