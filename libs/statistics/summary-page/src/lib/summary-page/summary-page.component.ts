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
  public sections: StatsChartSection[] = [];

  constructor(private service: SummaryPageService) {}

  public ngOnInit(): void {
    const biologyStats$: Observable<StatItem[]> = this.service.getBiologyStatItems();
    const simulationStats$: Observable<StatItem[]> = this.service.getSimulationStatItems();
    const sourceStats$: Observable<StatItem[]> = this.service.getSourceStatItems();

    this.sections.push({
      headingStart: 'Central access to models for a variety of',
      headingEnd: 'organisms, systems & scales',
      statItems$: biologyStats$,
    });

    this.sections.push({
      headingStart: 'Unified platform for numerous',
      headingEnd: 'modeling frameworks, algorithms, formats & tools',
      statItems$: simulationStats$,
    });

    this.sections.push({
      headingStart: 'Consolidated access to models from multiple',
      headingEnd: 'contributors & primary model repositories',
      statItems$: sourceStats$,
    });
  }
}
