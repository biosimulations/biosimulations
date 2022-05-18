import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StatItem, StatsChartSection } from '../summary-page.model';
import { SummaryPageService } from './summary-page.service';

@Component({
  selector: 'biosimulations-summary-page',
  templateUrl: './summary-page.component.html',
  styleUrls: ['./summary-page.component.scss'],
})
export class SummaryPageComponent implements OnInit {
  public modelStats$!: Observable<StatItem[]>;
  public simulationStats$!: Observable<StatItem[]>;
  public biologyStats$!: Observable<StatItem[]>;
  public sections: StatsChartSection[] = [];
  constructor(private service: SummaryPageService) {}

  public ngOnInit(): void {
    this.modelStats$ = this.service.getModelStatItems();
    this.simulationStats$ = this.service.getSimulationStatItems();
    this.biologyStats$ = this.service.getBiologyStatItems();

    this.sections.push({
      headingStart: 'Central access to models from various',
      headingEnd: 'domains, repositories & contributors',
      statItems$: this.modelStats$,
    });

    this.sections.push({
      headingStart: 'Interactive simulation of numerous',
      headingEnd: 'simulation frameworks, algorithms & tools',
      statItems$: this.simulationStats$,
    });

    this.sections.push({
      headingStart: 'Unified platform for modeling biology across',
      headingEnd: 'organisms, scales, and systems',
      statItems$: this.biologyStats$,
    });
  }
}
