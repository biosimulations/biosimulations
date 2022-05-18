import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { SummaryPageSectionComponent } from './summary-page-section/summary-page-section.component';

import { SharedUiModule } from '@biosimulations/shared/ui';

import { StatisticViewerComponent } from './statistic-viewer/statistic-viewer.component';
import { ChartComponent } from './chart/chart.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    SharedUiModule,
    NgChartsModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: SummaryPageComponent }]),
  ],
  declarations: [SummaryPageComponent, SummaryPageSectionComponent, StatisticViewerComponent, ChartComponent],
})
export class StatisticsSummaryPageModule {}
