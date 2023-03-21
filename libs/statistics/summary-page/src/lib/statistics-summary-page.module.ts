import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { SummaryPageSectionComponent } from './summary-page-section/summary-page-section.component';

import { StatisticViewerComponent } from './statistic-viewer/statistic-viewer.component';
import { ChartComponent } from './chart/chart.component';
import { NgChartsModule } from 'ng2-charts';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { SummaryPageSubsectionComponent } from './summary-page-subsection/summary-page-subsection.component';
import { BiosimulationsIconsModule } from '@biosimulations/shared/icons';
import { FlexModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    FlexModule,
    NgChartsModule,
    BiosimulationsIconsModule,
    RouterModule.forChild([{ path: '', pathMatch: 'full', component: SummaryPageComponent }]),
  ],
  declarations: [
    SummaryPageComponent,
    SummaryPageSectionComponent,
    StatisticViewerComponent,
    ChartComponent,
    SummaryPageSubsectionComponent,
  ],
})
export class StatisticsSummaryPageModule {}
